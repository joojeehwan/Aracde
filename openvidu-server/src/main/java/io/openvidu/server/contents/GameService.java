package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;

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

    /**
     * 게임 종류
     */
    // 이어서 그리기
    static final int CATCHMIND = 1;
    // 몸으로 말해요
    static final int CHARADES = 2;
    // 범인을 찾아라
    static final int GUESS = 3;
    // 업다운 게임
    static final int UPDOWN = 4;

    // params에 data를 추가해서 이 클래스를 통해 전달하는 형식
    static RpcNotificationService rpcNotificationService;
    // 게임 스레드 관리용
    protected ConcurrentHashMap<String, Thread> globalThread = new ConcurrentHashMap<>();
    // 순서
    protected ConcurrentHashMap<String, Map<Integer, String>> orderMap = new ConcurrentHashMap<>();
    // 그림 저장 <sessionId, [그림url, ...] }
    protected ConcurrentHashMap<String, ArrayList<String>> imageMap = new ConcurrentHashMap<>();
    // 단어 저장(캐치마인드)
    protected ConcurrentHashMap<String, String> answerMap = new ConcurrentHashMap<>();
    // 몸으로 말해요 단어 저장(중복 방지용)
    protected ConcurrentHashMap<String, ArrayList<String>> charadesWordMap = new ConcurrentHashMap<>();
    // 맞출사람, 범인 저장
    protected ConcurrentHashMap<String, String> dectectMap = new ConcurrentHashMap<>();
    protected ConcurrentHashMap<String, String> suspectMap = new ConcurrentHashMap<>();
    // 업다운 게임
    protected ConcurrentHashMap<String, Integer> updownMap = new ConcurrentHashMap<>();

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
                selectGame(participant, participants, message, params, data, rnfs);
                break;
            case STARTGAME: // 게임 실행
                startGame(participant, participants, message, params, data, rnfs);
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

        System.out.println("########## [ARCADE] : PrepareGame is called by " + participant.getParticipantPublicId());

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
                           JsonObject message, JsonObject params, JsonObject data, RpcNotificationService rnfs) {

        int peopleCnt = participants.size();
        int gameId = data.get("gameId").getAsInt();
        String sessionId = message.get("sessionId").getAsString();
        System.out.println("########## [ARCADE] : people count ="+peopleCnt+" gameId: "+gameId+" sessionId: "+sessionId);
       
        // idx 순서 섞기. idx는 1부터!!!!! 뒤에서 get(0)하면 null 나옴!!!!!
        int[] idxArr = new int[peopleCnt];
        for (int i = 0; i < peopleCnt; i++) {
            idxArr[i] = i+1;
        }

        // 순서 매핑
        Map<Integer, String> peopleOrder = new HashMap<>();

        System.out.println("########## [ARCADE] : idxArr: " + Arrays.toString(idxArr));

        int idx1, idx2;
        for (int i = 0; i < peopleCnt; i++) {
            idx1 = (int) (Math.random()*peopleCnt);
            idx2 = (int) (Math.random()*peopleCnt);
            swap(idxArr, idx1, idx2);
        }
        // 순서 섞였는지 체크
        int idx = 0;
        for (Participant p : participants) {
            peopleOrder.put(idxArr[idx], p.getPublisherStreamId());
            idx++;
        }
        orderMap.put(sessionId, peopleOrder);

        if (gameId == CATCHMIND) {
            // 이번 게임에서의 제시어를 미리 보내 줌
            System.out.println("########## [ARCADE] : START Catch Mind!!");
            WordGameUtil wordGameUtil = new WordGameUtil();
            int category = data.get("category").getAsInt();
            ArrayList<String> randWord;
            // category == 5 => all
            if (category == 5) {
                randWord = wordGameUtil.takeAllWord(1);
            // 나머지는 카테고리 선택한 경우
            } else {
                randWord = wordGameUtil.takeWord(category, 1);
            }
            String answer = randWord.get(0);

            System.out.println("answer: " + answer);
            data.addProperty("answer", answer);
            answerMap.put(sessionId, answer);
            // 첫번째 순서
            String curStreamId = peopleOrder.get(1);
            // 두번째 순서
            String nextStreamId = peopleOrder.get(2);
            data.addProperty("curStreamId", curStreamId);
            data.addProperty("nextStreamId", nextStreamId);



            // 이미지 저장용 리스트 생성
            ArrayList<String> imageList = new ArrayList<>();
            imageMap.put(sessionId, imageList);

        } else if (gameId == CHARADES) {
            System.out.println("########## [ARCADE] : START Charades!!");

            // 카테고리에 맞는 단어 가져오기
            WordGameUtil wordGameUtil = new WordGameUtil();
            int category = data.get("category").getAsInt();
            ArrayList<String> randWords;
            // category == 5 => all
            if (category == 5) {
                randWords = wordGameUtil.takeAllWord(peopleCnt);
                // 나머지는 카테고리 선택한 경우
            } else {
                randWords = wordGameUtil.takeWord(category, peopleCnt);
            }
            // 가져온 단어 정답 리스트에 저장
            charadesWordMap.put(sessionId, randWords);
            // 현재 제출할 사람과 답변
            data.addProperty("curStreamId", peopleOrder.get(1));
            data.addProperty("answer", randWords.get(0));

        } else if (gameId == GUESS) {
            // 첫번째 : 탐정, 두번째 : 범인. 이 게임 하려면 무조건 2명 이상이어야함
            String detectiveStreamId = peopleOrder.get(1);
            String suspectStreamId = peopleOrder.get(2);

            System.out.println("########## [ARCADE] : START Guess!!");
            // 탐정과 범인 지정
            data.addProperty("detectiveStreamId", detectiveStreamId);
            data.addProperty("suspectStreamId", suspectStreamId);
        } else if (gameId == UPDOWN) {
            System.out.println("########## [ARCADE] : START UpDown!!");
            // 답을 저장해 둔다.
            int answer = (int) (Math.random() *100) + 1;
            updownMap.put(sessionId, answer);

            System.out.println("########## [ARCADE] : " + sessionId + " is UPDOWN answer is " + answer);
            // 처음으로 답을 맞출 사람
            data.addProperty("curStreamId", peopleOrder.get(1));
        }

        data.addProperty("gameStatus", 2);
        System.out.println("########## [ARCADE] : data will be sent = " + data);

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
                             JsonObject message, JsonObject params, JsonObject data, RpcNotificationService rnfs) {

        int index = data.get("index").getAsInt(); // 이번 차례인 사람 index
        int peopleCnt = participants.size();
        int gameId = data.get("gameId").getAsInt();
        String sessionId = message.get("sessionId").getAsString();
        // 이번 세션의 사람 index 순서 저장해둔 맵
        Map<Integer, String> peopleOrder = orderMap.get(sessionId);
        System.out.println("########## [ARCADE] : " + sessionId + " Start Game => " + gameId);


        if (gameId == CATCHMIND) {
            // 이미지 추가
            String imageUrl = data.get("imageUrl").getAsString();
            ArrayList<String> imageList = imageMap.get(sessionId);
            // 마지막 순서는 imageUrl을 공백으로 보내주기 때문.
            if (!"".equals(imageUrl.trim())) {
                imageList.add(imageUrl);
                imageMap.put(sessionId, imageList);
            }
            // 맞출 사람
            // 마지막 차례에는 지금까지의 모든 이미지를 str으로 만들어 전송해 줌
            if (index == peopleCnt) {
                String answer = answerMap.get(sessionId);
                String response = data.get("response").getAsString();
                if (answer.equals(response)) {
                    data.addProperty("answerYn", "Y");
                } else {
                    data.addProperty("answerYn", "N");
                }

                    // 이미지 문자열 ( 프론트에서 | 으로 파싱)
                    String allImages = "";

                    for (int i = 0; i < imageList.size(); i++) {
                        String imgUrl = imageList.get(i);
                        if (i == imageList.size()-1) {
                            allImages = allImages.concat(imgUrl);
                        } else {
                            allImages = allImages.concat(imgUrl).concat("|");
                        }
                    }
                    System.out.printf("allImages: %s", allImages);
                    data.addProperty("allImages", allImages);
                }
                // 다음 차례
                String curStreamId = peopleOrder.get(++index);
                // 다다음차례, 마지막 차례인 사람에게는 안보내줌
                if (index < peopleCnt) {
                    String nextStreamId = peopleOrder.get(index + 1);
                    data.addProperty("nextStreamId", nextStreamId);
                }

            int orderStatus;
            // 다음차례가 마지막
            if (index == peopleCnt) {
                orderStatus = 2;
            } else if (index == peopleCnt - 1) {
                orderStatus = 1;
            } else {
                orderStatus = 0;
            }
            data.addProperty("orderStatus", orderStatus);
            data.addProperty("curStreamId", curStreamId);
            data.addProperty("imageUrl", imageUrl);
            data.addProperty("index", index);
            data.addProperty("gameStatus", 2);
        } else if (gameId == CHARADES) {
            System.out.println("########## [ARCADE] : " + sessionId + " doing CHARADES!");

            // 시간 경과 여부
            String timeout = data.get("timeout").getAsString();
            // 이번 세션 정답 목록
            ArrayList<String> charadesAnswers = charadesWordMap.get(sessionId);

            if ("N".equals(timeout)) {
                // 시간 내에 정답을 맞추려고 시도했다.
                String keyword = data.get("keyword").getAsString();
                System.out.println("########## [ARCADE] CHARADES : Is it Answer? " + keyword);

                String nowAnswer = charadesAnswers.get(index);
                if (nowAnswer.equals(keyword)) {
                    // 정답이다.
                    System.out.println("########## [ARCADE] CHARADES : Correct !!");
                    data.addProperty("answerYN", "Y");

                    // 마지막 사람인 경우
                    if (index == peopleCnt) {
                        // 게임 끝낸다.
                        data.addProperty("gameStatus", 3);
                    } else {
                        // 다음 사람으로 넘어간다.
                        data.addProperty("index", ++index);
                        data.addProperty("curStreamId", peopleOrder.get(index));
                        data.addProperty("answer", charadesAnswers.get(index));
                        data.addProperty("gameStatus", 2);
                    }
                } else {
                    // 틀렸다. 다시 정답을 맞춰봐야한다.
                    System.out.println("########## [ARCADE] CHARADES : WRONG !!!!");
                    data.addProperty("answerYN", "N");
                    data.addProperty("gameStatus", 2);
                }
            } else {
                // 시간 내에 정답을 맞추지 못했다.
                System.out.println("########## [ARCADE] CHARADES : Time is over!!!");
                // 마지막 사람인 경우
                if (index == peopleCnt) {
                    // 게임을 끝낸다.
                    data.addProperty("gameStatus", 3);
                } else {
                    // 다음 출제자와 답변을 보낸다.
                    data.addProperty("gameStatus", 2);
                    data.addProperty("index", ++index);
                    data.addProperty("curStreamId", peopleOrder.get(index));
                    data.addProperty("answer", charadesAnswers.get(index));
                }
            }
        } else if (gameId == GUESS) {

        } else if (gameId == UPDOWN) {
            System.out.println("########## [ARCADE] : " + sessionId + " doing UPDOWN!");
            int tryNumber = data.get("tryNumber").getAsInt();
            int answer = updownMap.get(sessionId);

            if (answer == tryNumber) {
                // 맞췄으니 게임 종료
                System.out.println("########## [ARCADE] CHARADES : " + peopleOrder.get(index) + " Correct !!");
                data.addProperty("answer", answer);
                data.addProperty("gameStatus", 2);
                data.addProperty("answerYN", 0);
                data.addProperty("answerStreamId", peopleOrder.get(index));
            } else {
                System.out.println("########## [ARCADE] CHARADES : " + peopleOrder.get(index) + " Wrong !!");
                // 틀린 경우
                index = index + 1;
                if (index > peopleCnt) {
                    // 몇 바퀴를 돌지 모르기때문에 사람 수를 넘어갔으면 index를 다시 줄여준다.
                    index -= peopleCnt;
                }
                data.addProperty("index", index);
                data.addProperty("nextStreamId", peopleOrder.get(index));
                data.addProperty("gameStatus", 2);

                if (answer > tryNumber) {
                    // 정답보다 작은 숫자를 입력한 경우
                    System.out.println("########## [ARCADE] CHARADES : " + tryNumber + " is lower than " + answer);
                    data.addProperty("answerYN", 1);
                } else {
                    // 정답보다 큰 숫자를 입력한 경우
                    System.out.println("########## [ARCADE] CHARADES : " + tryNumber + " is bigger than " + answer);
                    data.addProperty("answerYN", 2);
                }
            }
        }

        params.add("data", data);
        System.out.println("########## [ARCADE] Data will be sent : " + data);
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
        switch (gameId) {
            case CATCHMIND:
                System.out.println("########## [ARCADE] CATCH MIND IS OVER!!!");
                // 이미지맵도 제거
                answerMap.remove(sessionId);
                imageMap.remove(sessionId);
                break;
            case CHARADES:
                System.out.println("########## [ARCADE] CHARADES IS OVER!!!");
                charadesWordMap.remove(sessionId);
                break;
            case GUESS:
                System.out.println("########## [ARCADE] GUESS IS OVER!!!");
                break;
            case UPDOWN:
                System.out.println("########## [ARCADE] UPDOWN IS OVER!!!");
                updownMap.remove(sessionId);
                break;

        }

        data.addProperty("gameStatus", 3);
        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    }

}
