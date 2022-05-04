package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;
import org.checkerframework.checker.units.qual.C;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.parameters.P;

import javax.servlet.http.Part;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class GameService {

    /**
     * 게임 상태
     *
     * 게임 준비 : 게임 선택하는 화면을 클릭할 때,
     *
     * 게임 선택 : 특정 게임을 선택하고, 시작하기 전,
     *
     * 게임 시작 : 시작 버튼을 누를 때. (게임 진행 과정에 필요한 로직들이 포함되어야 함)
     *
     * 게임 종료 : 종료 조건이 되었거나, 게임을 종료할 때
     */
//    // 게임 비활성화
//    static final int NOGAME = -1;
    // 게임 준비
    static final int PREPAREGAME = 0;
    // 게임선택
    static final int SELECTGAME = 1;
    // 게임 시작
    static final int STARTGAME = 2;
    // 게임 종료
    static final int FINISHGAME = 3;
    // 게임 패널티
    static final int PENALTYGAME = 4;
    /**
     * 게임 종류
     */
    // 이어서 그리기
    static final int CATCHMIND = 1;
    // 범인을 찾아라
    static final int GUESS = 2;
    // 몸으로 말해요
    static final int CHARDES = 3;

    // params에 data를 추가해서 이 클래스를 통해 전달하는 형식
    static RpcNotificationService rpcNotificationService;
    private static final Logger log = LoggerFactory.getLogger(GameService.class);
    // 순서
    protected ConcurrentHashMap<String, Map<Integer, String>> orderMap = new ConcurrentHashMap<>();
    // 그림 저장 <sessionId, [그림url, ...] }
    protected ConcurrentHashMap<String, ArrayList<String>> imageMap = new ConcurrentHashMap<>();
    // 단어 저장(중복 방지용)
    protected ConcurrentHashMap<String, Map<String, Integer>> wordMap = new ConcurrentHashMap<>();



    // 인덱스 순서 섞는 용
    public void swap(int[] arr, int idx1, int idx2) {
        int temp = arr[idx1];
        arr[idx1] = arr[idx2];
        arr[idx2] = temp;
    }

    public void controlGame(Participant participant, JsonObject message, Set<Participant> participants,
                            RpcNotificationService rnfs) {
        rpcNotificationService = rnfs;

        JsonObject params = new JsonObject();
        // 요청한 사람 ID 저장
        if (participant != null) {
            params.addProperty(ProtocolElements.PARTICIPANTSENDMESSAGE_FROM_PARAM,
                    participant.getParticipantPublicId());
        }
        // 타입 저장
        if (message.has("type")) {
            params.addProperty(ProtocolElements.PARTICIPANTSENDMESSAGE_TYPE_PARAM, message.get("type").getAsString());
        }
        // data 파싱
        String dataString = message.get("data").getAsString();
        JsonObject data = (JsonObject) JsonParser.parseString(dataString);

        // gameStatus
        int gameStatus = data.get("gameStatus").getAsInt();

        data.addProperty("gameStatus", gameStatus);

        switch (gameStatus) {

            case PREPAREGAME:
                prepareGame(participant, participants, message, params, data);
                break;
            case SELECTGAME:
                selectGame(participant, participants, message, params, data);
                break;
            case STARTGAME:
                startGame(participant, participants, message, params, data);
                break;
            case FINISHGAME:
                finishGame(participant, participants, message, params, data);
                break;
        }
    }

    /**
     *  게임 비활성화 상태
     *  gameStatus: -1
     * */


    /**
     *  게임 준비 상태
     *  gameStatus: 0
     *  특정 사용자가 게임을 선택하는 동안, 다른 사용자들은 '게임 선택 중입니다' 화면이 보이도록 구현
     * */
    private void prepareGame(Participant participant, Set<Participant> participants,
                             JsonObject message, JsonObject params, JsonObject data) {

        log.info("PrepareGame is called by {}", participant.getParticipantPublicId());
        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    }

    /**
     *  게임 선택
     *  gameStatus: 1
     * */
    public void selectGame(Participant participant, Set<Participant> participants,
                           JsonObject message, JsonObject params, JsonObject data) {

        int peopleCnt = participants.size();
        int gameId = data.get("gameId").getAsInt();
        String sessionId = message.get("sessionId").getAsString();
        
        // 순서 매핑
        Map<Integer, String> peopleMap = new HashMap<>();
       
        // idx 순서 섞기
        int[] idxArr = new int[peopleCnt];
        for (int i = 0; i < peopleCnt; i++) {
            idxArr[i] = i+1;
        }

        System.out.println("idxArr: " + idxArr);
        int idx1, idx2;
        for (int i = 0; i < peopleCnt; i++) {
            idx1 = (int) (Math.random()*peopleCnt);
            idx2 = (int) (Math.random()*peopleCnt);
            swap(idxArr, idx1, idx2);
        }
        // 순서 섞였는지 체크
        System.out.println("idxArr: " + idxArr);

        // 인덱스, streamId 매핑 (순서)
        int idx = 0;
        for (Participant p : participants) {
            peopleMap.put(idxArr[idx], p.getPublisherStreamId());
            idx++;
        }
        orderMap.put(sessionId, peopleMap);


        // 1번순서 => 키워드 입력하고 첫 그림 시작, 마지막 순서 => 문제를 맞춰야 함
        if (gameId == CATCHMIND) {
            // 첫번째 순서 탐색
            peopleMap = orderMap.get(sessionId);
            String curStreamId = peopleMap.get(0);
            data.addProperty("streamId", curStreamId);
            data.addProperty("index", 0);
            data.addProperty("gameStatus", 2);

            // 이미지 저장용 리스트 생성
            ArrayList<String> imageList = new ArrayList<>();
            imageMap.put(sessionId, imageList);

            // 보낼 제시어들 전송
            WordGameUtil wordGameUtil = new WordGameUtil();
            List<String> wordList = wordGameUtil.takeAllWord();

        }else if (gameId == GUESS) {
            List<Object> participantList = Arrays.asList(participants.toArray());
            Collections.shuffle(participantList);
            // 섞어서 0번쨰에 오는 사람의 streamId가 술래(출제자)
            Participant target = (Participant) participantList.get(0);

            // 술래 지정
            data.addProperty("tagStreamId", target.getPublisherStreamId());
            data.addProperty("gameStatus", 2);
        }else if (gameId == CHARDES) {
            Map<String, Integer> peopleWord = new HashMap<>();
            wordMap.put(sessionId, peopleWord);
            List<Object> participantList = Arrays.asList(participants.toArray());
            Collections.shuffle(participantList);
            // 섞어서 0번쨰에 오는 사람의 streamId가 술래(출제자)
            Participant target = (Participant) participantList.get(0);

            // 출제자 지정
            data.addProperty("tagStreamId", target.getPublisherStreamId());
            data.addProperty("gameStatus", 2);
        }

        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    }

    /**
     *  게임 진행
     *  gameStatus: 2
     * */
    public void startGame(Participant participant, Set<Participant> participants,
                             JsonObject message, JsonObject params, JsonObject data) {

        int index = data.get("index").getAsInt();
        int number = participants.size();
        int gameId = data.get("gameId").getAsInt();
        String sessionId = message.get("sessionId").getAsString();
        switch (gameId) {
            case CATCHMIND:
                // 이미지 추가
                String imageUrl = data.get("imageUrl").getAsString();
                ArrayList<String> imageList = imageMap.get(sessionId);
                imageList.add(imageUrl);
                imageMap.put(sessionId, imageList);

                String answer = data.get("answer").getAsString();
                // 처음 출제자의 경우 제시어 선택
                if (index == 0) {
                    data.addProperty("answer", answer);
                }
                // 맞출 사람
                else if (index == number - 1) {
                    String keyword = data.get("keyword").getAsString();
                    if (answer.equals(keyword)) {
                        data.addProperty("isRight", "Y");
                    } else {
                        data.addProperty("isRight", "N");
                    }
                }
                //다음 차례에게 그림 보내줌
                Map<Integer, String> peopleOrder = orderMap.get(sessionId);
                String curStreamId = peopleOrder.get(++index);
                data.addProperty("curStreamId", curStreamId);
                data.addProperty("imageUrl", imageUrl);
                data.addProperty("index", index);
                break;
            case GUESS:

                break;

            case CHARDES:
                Random rand = new Random();
                WordGameUtil wordGameUtil = new WordGameUtil();
                // 카테고리
                String category = data.get("category").getAsString();
                String targetStreamId = data.get("targetStreamId").getAsString();
                List<String> wordList = wordGameUtil.takeWord(category);

                Map<String, Integer> wordOrder = wordMap.get(sessionId);
                // 중복 없는 단어 나올 때까지 random 반복
                while (true) {
                    // 전체 요소중 임의로 추출
                    String word = wordList.get(rand.nextInt(wordList.size()));

                    if (!wordOrder.containsKey(word)) {
                        wordOrder.put(word, 1);
                        break;
                    }
                }
                
                break;

        }
        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    }

    /**
     *  게임 종료
     *  gameStatus: 3
     * */
    public void finishGame(Participant participant, Set<Participant> participants,
                           JsonObject message, JsonObject params, JsonObject data) {

        int gameId = data.get("gameId").getAsInt();
        String sessionId = message.get("sessionId").getAsString();

        // 게임 끝났으면 제외 시켜 준다.
        orderMap.remove(sessionId);
        if (gameId == CATCHMIND) {
            orderMap.remove(sessionId);
            imageMap.remove(sessionId);
        }else if (gameId == GUESS) {
            System.out.println("잠깐만");
        }else if (gameId == CHARDES) {
            wordMap.remove(sessionId);

        }

        data.addProperty("gameStatus", 3);
        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    }


}
