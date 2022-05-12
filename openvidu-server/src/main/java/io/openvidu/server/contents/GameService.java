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

    // 로그 남기는 용
    private static final Logger log = LoggerFactory.getLogger(GameService.class);


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
    // 처음 게임 시작한 사람
    protected ConcurrentHashMap<String, String> starterMap = new ConcurrentHashMap<>();
    // 순서
    protected ConcurrentHashMap<String, Map<Integer, String>> orderMap = new ConcurrentHashMap<>();
    // 그림 저장 <sessionId, [그림url, ...] }
    protected ConcurrentHashMap<String, ArrayList<String>> imageMap = new ConcurrentHashMap<>();
    // 단어 저장(캐치마인드)
    protected ConcurrentHashMap<String, String> answerMap = new ConcurrentHashMap<>();
    // 몸으로 말해요 단어 저장(중복 방지용)
    protected ConcurrentHashMap<String, ArrayList<String>> charadesWordMap = new ConcurrentHashMap<>();
    // 맞출사람, 범인 저장
    protected ConcurrentHashMap<String, String> detectMap = new ConcurrentHashMap<>();
    protected ConcurrentHashMap<String, String> suspectMap = new ConcurrentHashMap<>();
    protected ConcurrentHashMap<String, Integer> chanceMap = new ConcurrentHashMap<>();
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

        log.info("########## [아케이드] : 게임준비하세요~! ");
        // 요청자 streamId
        String starterStreamId = participant.getPublisherStreamId();
        String sessionId = message.get("sessionId").getAsString();
        if (!"".equals(starterMap.get(sessionId))) {
            // 데이터가 존재하는 경우 지우고 새로 넣어야 한다.
            starterMap.remove(sessionId);
        }
        log.info("########## [아케이드] 게임 준비중 : 세션아이디 = " + sessionId + " & 게임 시작한사람 = " + starterStreamId);
        log.info("########## [아케이드] 게임 시작한사람 저장한 맵 : " + starterMap);
        starterMap.put(sessionId, starterStreamId);

        data.addProperty("streamId", starterStreamId);
        data.addProperty("gameStatus", 0);
        params.add("data", data);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    }

    /**
     *  게임 선택 (재시작 포함)
     *  gameStatus: 1
     * */
    public void selectGame(Participant participant, Set<Participant> participants,
                           JsonObject message, JsonObject params, JsonObject data) {

        int peopleCnt = participants.size();
        int gameId = data.get("gameId").getAsInt();
        String sessionId = message.get("sessionId").getAsString();
        log.info("########## [아케이드] : 게임 선택했습니다!!!! ");
        log.info("########## [아케이드] : 방 인원 수 ="+peopleCnt+" & 고른 게임 아이디 = "+gameId+" 세션아이디: "+sessionId);

        // idx 순서 섞기. idx는 1부터!!!!! 뒤에서 get(0)하면 null 나옴!!!!!
        int[] idxArr = new int[peopleCnt];
        for (int i = 0; i < peopleCnt; i++) {
            idxArr[i] = i+1;
        }

        // 순서 매핑
        Map<Integer, String> peopleOrder = new HashMap<>();


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

        log.info("########## [아케이드] : 지금 사람 순서 = " + peopleOrder);
        orderMap.put(sessionId, peopleOrder);

        if (gameId == CATCHMIND) {
            String playYn;
            if (peopleCnt < 2) {
                playYn = "N";
            } else {
                playYn = "Y";
                // 이번 게임에서의 제시어를 미리 보내 줌
                log.info("########## [아케이드] : 캐치마인드 시작!!");
                WordGameUtil wordGameUtil = new WordGameUtil();
                int category = data.get("category").getAsInt();
                ArrayList<String> randWord;
                // category == 6 => all
                if (category == 6) {
                    randWord = wordGameUtil.takeAllWord(1);
                    // 나머지는 카테고리 선택한 경우
                } else {
                    randWord = wordGameUtil.takeWord(category, 1);
                }
                String answer = randWord.get(0);

                log.info("########## [아케이드] : 정답 = " + answer);
                data.addProperty("answer", answer);
                answerMap.put(sessionId, answer);
                // 첫번째 순서
                String curStreamId = peopleOrder.get(1);
                // 두번째 순서
                String nextStreamId = peopleOrder.get(2);
                data.addProperty("curStreamId", curStreamId);
                data.addProperty("nextStreamId", nextStreamId);
                data.addProperty("time", 60);
                ArrayList<String> imageList = new ArrayList<>();
                imageMap.put(sessionId, imageList);
            }
            data.addProperty("playYn", playYn);

        }
        else if (gameId == CHARADES) {
            log.info("########## [아케이드] : 몸으로 말해요 시작!!");

            // 카테고리에 맞는 단어 가져오기
            WordGameUtil wordGameUtil = new WordGameUtil();
            int category = data.get("category").getAsInt();
            ArrayList<String> randWords = new ArrayList<>();
            randWords.add("index");
            // category == 6 => all
            if (category == 6) {
                randWords.addAll(wordGameUtil.takeAllWord(peopleCnt));
                // 나머지는 카테고리 선택한 경우
            } else {
                randWords.addAll(wordGameUtil.takeWord(category, peopleCnt));
            }
            // 가져온 단어 정답 리스트에 저장
            charadesWordMap.put(sessionId, randWords);
            // 현재 제출할 사람과 답변
            data.addProperty("curStreamId", peopleOrder.get(1));
            data.addProperty("answer", randWords.get(1));
            log.info("########## [아케이드] : 정답 목록 = " + randWords);

        }
        else if (gameId == GUESS) {
            log.info("########## [아케이드] : 너의 목소리가 들려 시작!!");
            // 첫번째 : 탐정, 두번째 : 범인. 이 게임 하려면 무조건 2명 이상이어야함
            String playYn;
            if (peopleCnt < 3) {
                    playYn = "N";
            } else {
                playYn = "Y";
                // 사람 수 만큼 있는 [1 ~ 사람 수 ] 배열에서 랜덤으로 2개 뽑아서 하나씩 쓰고 저장한다.
                // 1, 2로 하면 무조건 첫번째 또는 마지막에 발언하는 사람이 범인이기 때문이다.
                List<Integer> randomIndexList = new ArrayList<>();
                for (int i = 1; i < peopleCnt+1; i++) {
                    // 사람 인덱스는 1부터 저장하고 있기 때문이다.
                    randomIndexList.add(i);
                }
                // 인덱스 리스트를 섞는다. 이 detectSuspectList는 여기서 쓰고 버린다.
                Collections.shuffle(randomIndexList);

                // 섞인 인덱스 리스트에서 각각 첫번째, 두번째를 뽑으면 랜덤을 두번 돌린 셈이 된다.
                String detectiveStreamId = peopleOrder.get(randomIndexList.get(0));
                String suspectStreamId = peopleOrder.get(randomIndexList.get(1));

                String speakStreamId = "";
                // 그냥 참가자 순서대로 하는데 이게 맞추는 사람이면 다음 사람으로 넘어간다.
                for (int i = 1; i < peopleCnt+1; i++){
                    String nowStreamId = peopleOrder.get(i);
                    if (!nowStreamId.equals(detectiveStreamId)) {
                        // 첫번째 말할 사람이 탐정과 아이디가 다르기만 하면 된다. 범인인지는 상관없음.
                        speakStreamId = nowStreamId;
                        break;
                    }
                }

                detectMap.put(sessionId, detectiveStreamId);
                suspectMap.put(sessionId, suspectStreamId);

                // 기회는 4명까지는 1번, 5명 부터는 2번
                int chance = Math.round(peopleCnt/3);
                chanceMap.put(sessionId, chance);

                // 탐정과 범인 지정
                data.addProperty("detectiveStreamId", detectiveStreamId);
                data.addProperty("suspectStreamId", suspectStreamId);
                // 첫번째 발언권
                data.addProperty("curStreamId", speakStreamId);
            }
            data.addProperty("playYn", playYn);
        }
        else if (gameId == UPDOWN) {
            log.info("########## [아케이드] : 업다운 게임 시작!!");
            // 답을 저장해 둔다.
            int answer = (int) (Math.random() *100) + 1;
            updownMap.put(sessionId, answer);

            log.info("########## [아케이드] : 세션아이디 " + sessionId + " 의 업다운 정답은 = " + answer);
            // 처음으로 답을 맞출 사람
            data.addProperty("curStreamId", peopleOrder.get(1));
        }

        data.addProperty("gameStatus", 2);
        log.info("########## [아케이드] : 보내줄 데이터는!! = " + data);

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

        int index = data.get("index").getAsInt(); // 이번 차례인 사람 index
        int peopleCnt = participants.size();
        int gameId = data.get("gameId").getAsInt();
        String sessionId = message.get("sessionId").getAsString();
        // 이번 세션의 사람 index 순서 저장해둔 맵
        Map<Integer, String> peopleOrder = orderMap.get(sessionId);
        log.info("########## [아케이드] : 세션아이디 " + sessionId + "의 사람 목록 => " + peopleOrder);


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
                // 마지막. 처음 시작한 사람이 누구인지 알아야한다.
                String startStreamId = starterMap.get(sessionId);
                data.addProperty("startStreamId", startStreamId);
                // 정답도 무엇이었는지 알려줘야 한다. 공백은 제거한다.
                String answer = answerMap.get(sessionId).replaceAll("\\s", "");
                data.addProperty("answer", answer);

                // 응답 값에도 공백들은 다 지운다.
                String response = data.get("response").getAsString().replaceAll("\\s", "");

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
                    log.info("########## [아케이드] : 모든 이미지 링크 = " + allImages);
                    data.addProperty("gameStatus", 2);
                    data.addProperty("allImages", allImages);
            // 마지막 사람 외에는, 이전사람 그림과, gameStatus값을 보내 줌
            } else {
                data.addProperty("imageUrl", imageUrl);
            }
            // 다음 차례
            String curStreamId = peopleOrder.get(++index);
            // 다다음차례, 마지막 차례인 사람에게는 안보내줌
            if (index < peopleCnt) {
                String nextStreamId = peopleOrder.get(index + 1);
                data.addProperty("nextStreamId", nextStreamId);
            }
            // 제한시간 부여
            int time;
            int orderStatus;
            // 다음차례가 마지막
            if (index == peopleCnt) {
                orderStatus = 2;
            } else if (index == peopleCnt - 1) {
                orderStatus = 1;
                time = 15;
                data.addProperty("time", time);
            } else {
                orderStatus = 0;
                // 10초씩 감소
                time = (60 - (index-1)*10);
                data.addProperty("time", time);
            }
            data.addProperty("orderStatus", orderStatus);
            data.addProperty("curStreamId", curStreamId);
            data.addProperty("index", index);
        }
        else if (gameId == CHARADES) {
            log.info("########## [아케이드] : 세션 아이디 " + sessionId + "에서 몸으로 말해요 진행중!!!");

            // 시간 경과 여부
            String timeout = data.get("timeout").getAsString();
            // 이번 세션 정답 목록
            ArrayList<String> charadesAnswers = charadesWordMap.get(sessionId);

            if ("N".equals(timeout)) {
                // 시간 내에 정답을 맞추려고 시도했다.
                // 뭐라고 시도했는지 저장. 공백은 다 제거한다.
                String keyword = data.get("keyword").getAsString().replaceAll("\\s", "");
                log.info("########## [아케이드] 몸으로 말해요에서 시도한 정답은?? = " + keyword);

                String nowAnswer = charadesAnswers.get(index).replaceAll("\\s", "");
                log.info("########## [아케이드] 몸으로 말해요의 인덱스 = " + index + " & 정답 = " + nowAnswer);
                if (nowAnswer.equals(keyword)) {
                    // 정답이다.
                    data.addProperty("answerYN", "Y");
                    // 정답 맞춘 사람
                    data.addProperty("answerStreamId", participant.getPublisherStreamId());
                    log.info("########## [아케이드] 몸으로 말해요 : "+ participant.getPublisherStreamId() + "는 정답입니다!!");

                    // 마지막 사람인 경우
                    if (index == peopleCnt) {
                        // 게임 끝낸다.
                        data.addProperty("gameStatus", 2);
                    } else {
                        // 다음 사람으로 넘어간다.
                        data.addProperty("index", ++index);
                        data.addProperty("curStreamId", peopleOrder.get(index));
                        data.addProperty("answer", charadesAnswers.get(index));
                    }
                } else {
                    // 틀렸다. 다시 정답을 맞춰봐야한다.
                    log.info("########## [아케이드] 몸으로 말해요 : 정답이 아닙니다!!!!");
                    data.addProperty("answerYN", "N");
                }
            } else {
                // 시간 내에 정답을 맞추지 못했다.
                log.info("########## [아케이드] 몸으로 말해요 : 시간 초과!!!!!!!!!!");
                // 마지막 사람인 경우
                if (index == peopleCnt) {
                    // 게임을 끝낸다.
                } else {
                    // 다음 출제자와 답변을 보낸다.
                    data.addProperty("index", ++index);
                    data.addProperty("curStreamId", peopleOrder.get(index));
                    data.addProperty("answer", charadesAnswers.get(index));
                }
            }
        }
        else if (gameId == GUESS) {
            log.info("########## [아케이드] : 세션아이디 " + sessionId + "에서 너의 목소리가 들려를 합니다!");
            log.info("########## [아케이드] : 받은 인덱스 값은 = " + index);
            // index가 -1이라는 것은 모두가 발언하고 난 뒤 답을 추리해봤다는 것
            if (index == -1) {
                String tryAnswer = data.get("tryAnswer").getAsString();
                String answer = suspectMap.get(sessionId);
                if (answer.equals(tryAnswer)) {
                    log.info("########## [아케이드] 몸으로 말해요 : 정답 !!");
                    data.addProperty("answerYN", 0);
                } else {
                    // 현재 남은 맞출 기회
                    int chance = chanceMap.get(sessionId);
                    log.info("########## [아케이드] 몸으로 말해요 : 틀렸어요!!!! !!");
                    // 횟수 한번 차감
                    chance--;
                    log.info("########## [아케이드] 몸으로 말해요 : 남은 기회는 = " + chance);
                    if (chance > 0) {
                        // 아직 기회가 남았다.
                        data.addProperty("answerYN", 2);
                    } else {
                        // 이제 기회가 없다.
                        data.addProperty("answerYN", 1);
                    }
                }
            }
            else if (index > peopleCnt) {
                log.info("########## [아케이드] 너의 목소리가 들려 : 모두가 발언을 했습니다. 이제 맞춰봐!");
                data.addProperty("finishPR", "Y");
            }
            else if (0 < index){
                // 아직 발언 한명씩 진행중
                // index가 0이면 받은 그대로 보내줄 수 있도록
                String curStreamId = peopleOrder.get(index);
                String detectStreamId = detectMap.get(sessionId);
                String spokenStreamId = data.get("spokenStreamId").getAsString();
                // 지금 말한 사람을 또 골라줄거면 넘어가
                if (curStreamId.equals(spokenStreamId)) {
                    log.info("########## [아케이드] 너의 목소리가 들려 : 이미 말했던 사람이니 다음 사람으로 넘어갑니다.");
                    index++;
                    if (index > peopleCnt) {
                        data.addProperty("finishPR", "Y");
                    } else {
                        curStreamId = peopleOrder.get(index);
                    }
                }
                // 지금 말할사람이 탐정이면 넘어가
                if (detectStreamId.equals(curStreamId)) {
                    log.info("########## [아케이드] 너의 목소리가 들려 : 탐정은 발언 기회가 필요 없습니다.");
                    index++;
                    if (index > peopleCnt) {
                        data.addProperty("finishPR", "Y");
                    }
                    else {
                        curStreamId = peopleOrder.get(index);
                        // 지금 말한 사람을 또 골라줄거면 넘어가
                        if (curStreamId.equals(spokenStreamId)) {
                            log.info("########## [아케이드] 너의 목소리가 들려 : 탐정 다음 사람은 말했던 사람이라 넘어갑니다.");
                            index++;
                            curStreamId = peopleOrder.get(index);
                        }
                    }
                }
                data.addProperty("curStreamId", curStreamId);
                // 다음에 말할 사람 인덱스
                data.addProperty("index", index+1);
            }
        }
        else if (gameId == UPDOWN) {
            log.info("########## [아케이드] : 세션아이디 " + sessionId + "에서 업다운 진행중!");
            int tryNumber = data.get("tryNumber").getAsInt();
            int answer = updownMap.get(sessionId);

            if (answer == tryNumber) {
                // 맞췄으니 게임 종료
                log.info("########## [아케이드] 업다운 : " + peopleOrder.get(index) + "가 정답을 맞췄다 !!");
                data.addProperty("answer", answer);
                data.addProperty("answerYN", 0);
                data.addProperty("answerStreamId", peopleOrder.get(index));
            } else {
                log.info("########## [아케이드] 업다운 : " + peopleOrder.get(index) + "는 틀렸다 !!");
                // 틀린 경우
                index = index + 1;
                if (index > peopleCnt) {
                    // 몇 바퀴를 돌지 모르기때문에 사람 수를 넘어갔으면 index를 다시 줄여준다.
                    index -= peopleCnt;
                }
                data.addProperty("index", index);
                data.addProperty("nextStreamId", peopleOrder.get(index));

                if (answer > tryNumber) {
                    // 정답보다 작은 숫자를 입력한 경우
                    log.info("########## [아케이드] 업다운 : " + tryNumber + "는 정답보다 작아. 정답은 = " + answer);
                    data.addProperty("answerYN", 1);
                } else {
                    // 정답보다 큰 숫자를 입력한 경우
                    log.info("########## [아케이드] 업다운 : " + tryNumber + "는 정답보다 커. 정답은 = " + answer);
                    data.addProperty("answerYN", 2);
                }
            }
        }

        params.add("data", data);
        log.info("########## [아케이드] 보낼 데이터는 = " + data);
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
                log.info("########## [아케이드] 캐치마인드 종료!!!");
                // 이미지맵도 제거
                answerMap.remove(sessionId);
                imageMap.remove(sessionId);
                break;
            case CHARADES:
                log.info("########## [아케이드] 몸으로 말해요 종료!!!");
                charadesWordMap.remove(sessionId);
                break;
            case GUESS:
                log.info("########## [아케이드] 너의 목소리가 들려 종료!!!");
                detectMap.remove(sessionId);
                suspectMap.remove(sessionId);
                chanceMap.remove(sessionId);
                break;
            case UPDOWN:
                log.info("########## [아케이드] 업다운게임 종료!!!");
                updownMap.remove(sessionId);
                break;

        }


        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    }

}
