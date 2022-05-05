package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    static final int CHARADES = 3;

    // params에 data를 추가해서 이 클래스를 통해 전달하는 형식
    static RpcNotificationService rpcNotificationService;
    private static final Logger log = LoggerFactory.getLogger(GameService.class);

    // 게임 스레드 관리용
    protected ConcurrentHashMap<String, Thread> globalThread = new ConcurrentHashMap<>();
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

        // 게임 상태도 담아서 현재 참여자 전원에게 전달해줘야한다.
        data.addProperty("gameStatus", gameStatus);

        switch (gameStatus) {

            case PREPAREGAME:
                prepareGame(participant, participants, message, params, data);
                break;
            case SELECTGAME: // 게임 선택
                selectGame(participant, participants, message, params, data);
                break;
            case STARTGAME: // 게임 실행
                startGame(participant, participants, message, params, data);
                break;
            case FINISHGAME: // 게임 종료
                finishGame(participant, participants, message, params, data);
                break;
        }
    }

    /**
     *  게임 준비 상태
     *  gameStatus: 0
     *  특정 사용자가 게임을 선택하는 동안, 다른 사용자들은 '게임 선택 중입니다' 화면이 보이도록 구현
     *  -> 위의 화면은 게임을 동시에 선택하는 것을 막기 위한 것이라서 프론트와 상의해야함.
     * */
    private void prepareGame(Participant participant, Set<Participant> participants,
                             JsonObject message, JsonObject params, JsonObject data) {

        log.info("ARCADE : PrepareGame is called by {}", participant.getParticipantPublicId());

        // 요청자 streamId (이 값이 맞는지는 테스트 해봐야 될 듯)
        String streamId = participant.getParticipantPublicId();

        data.addProperty("streamId", streamId);
        data.addProperty("gameStatus", 0);
        params.add("data", data);
        // 브로드 캐스팅
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
        log.info("ARCADE : people count = {} , gameId = {}, sessionId = {}", peopleCnt, gameId, sessionId);

        // 순서 매핑
        Map<Integer, String> peopleMap = new HashMap<>();
       
        // idx 순서 섞기
        int[] idxArr = new int[peopleCnt];
        for (int i = 0; i < peopleCnt; i++) {
            idxArr[i] = i+1;
        }

        // 순서 매핑
        Map<Integer, String> peopleOrder = new HashMap<>();


        System.out.println("idxArr: " + Arrays.toString(idxArr));
        int idx1, idx2;
        for (int i = 0; i < peopleCnt; i++) {
            idx1 = (int) (Math.random()*peopleCnt);
            idx2 = (int) (Math.random()*peopleCnt);
            swap(idxArr, idx1, idx2);
        }
        // 순서 섞였는지 체크
        log.info("ARCADE : 사람 섞은 인덱스 배열 {}", idxArr);

        int idx = 0;
        for (Participant p : participants) {
            peopleOrder.put(idxArr[idx], p.getPublisherStreamId());
            idx++;
        }
        orderMap.put(sessionId, peopleOrder);

        if (gameId == CATCHMIND) {
            // 이번 게임에서의 제시어를 미리 보내 줌
            log.info("ARCADE : START Catch Mind!!");
            WordGameUtil wordGameUtil = new WordGameUtil();
            List<String> randWord = wordGameUtil.takeAllWord();
            Collections.shuffle(randWord);
            String answer = randWord.get(0);
            data.addProperty("answer", answer);
            // 첫번째 순서
            String curStreamId = peopleOrder.get(0);
            data.addProperty("curStreamId", curStreamId);

            // 이미지 저장용 리스트 생성
            ArrayList<String> imageList = new ArrayList<>();
            imageMap.put(sessionId, imageList);

        }else if (gameId == GUESS) {
            // 첫번째 : 탐정, 두번째 : 범인
            String detectiveStreamId = peopleOrder.get(0);
            String suspectStreamId = peopleOrder.get(1);
            log.info("ARCADE : START Guess!!");
            // 탐정과 범인 지정
            data.addProperty("detectiveStreamId", detectiveStreamId);
            data.addProperty("suspectStreamId", suspectStreamId);

        }else if (gameId == CHARADES) {
            log.info("ARCADE : START Charades!!");
            Map<String, Integer> wordOrder = new HashMap<>();
            wordMap.put(sessionId, wordOrder);

            // 섞어서 0번쨰에 오는 사람의 streamId가 술래(출제자)
            String curStreamId = peopleOrder.get(0);

            // 출제자 지정
            data.addProperty("curStreamId", curStreamId);
        }

        data.addProperty("gameStatus", 2);

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
        int peopleCnt = participants.size();
        int gameId = data.get("gameId").getAsInt();
        String sessionId = message.get("sessionId").getAsString();
        if (index >= peopleCnt) {
            index -= peopleCnt;
        }
        switch (gameId) {
            case CATCHMIND:
                // 이미지 추가
                String imageUrl = data.get("imageUrl").getAsString();
                ArrayList<String> imageList = imageMap.get(sessionId);
                // 마지막 순서는 imageUrl을 공백으로 보내주기 때문.
                if ("".equals(imageUrl.trim())) {
                    imageList.add(imageUrl);
                    imageMap.put(sessionId, imageList);
                }
                // 맞출 사람
                // 마지막 차례에는 지금까지의 모든 이미지를 str으로 만들어 전송해 줌
                if (index == peopleCnt - 1) {
                    String answer = data.get("answer").getAsString();
                    String response = data.get("response").getAsString();
                    if (answer.equals(response)) {
                        data.addProperty("answerYn", "Y");
                    } else {
                        data.addProperty("answerYn", "N");
                    }

                    // 이미지 문자열 ( 프론트에서 & 으로 파싱)
                    String allImages = "";

                    for (int i = 0; i < imageList.size(); i++) {
                        String imgUrl = imageList.get(i);
                        if (i == imageList.size()-1) {
                            allImages = allImages.concat(imgUrl);
                        } else {
                            allImages = allImages.concat(imgUrl).concat("&");
                        }
                    }
                    System.out.printf("allImages: %s", allImages);
                    data.addProperty("allImages", allImages);
                }
                //다음 차례에게 그림 보내줌
                Map<Integer, String> peopleOrder = orderMap.get(sessionId);
                // 다음 차례
                String curStreamId = peopleOrder.get(++index);
                data.addProperty("curStreamId", curStreamId);
                data.addProperty("imageUrl", imageUrl);
                data.addProperty("index", index);
                break;
            case GUESS:

                break;

            case CHARADES:
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
        data.addProperty("gameStatus", 2);
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
            // 이미지맵도 제거
            imageMap.remove(sessionId);
        }else if (gameId == GUESS) {
            System.out.println("잠깐만");
        }else if (gameId == CHARADES) {
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
