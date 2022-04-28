package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;
import org.springframework.security.core.parameters.P;

import javax.servlet.http.Part;
import java.util.*;

public class GameService {

    /**
     * 게임 상태
     */
    // 게임 비활성화
    static final int NOGAME = -1;
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
    static final int RELAY = 1;
    // 범인을 찾아라
    static final int TAG = 2;
    // 몸으로 말해요
    static final int BODY = 3;

    // params에 data를 추가해서 이 클래스를 통해 전달하는 형식
    static RpcNotificationService rpcNotificationService;

    // 순서
    protected HashMap<String, Map<Integer, String>> sOrderMap = new HashMap<>();
    protected HashMap<String, Map<String, String>> sNickMap = new HashMap<>();

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
            case NOGAME:
                noGame(participant, participants, message, params, data);
                break;
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
    private void noGame(Participant participant, Set<Participant> participants,
                        JsonObject message, JsonObject params, JsonObject data) {
        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    }

    /**
     *  게임 준비 상태
     *  gameStatus: 0
     *  특정 사용자가 게임을 선택하는 동안, 다른 사용자들은 '게임 선택 중입니다' 화면이 보이도록 구현
     * */
    private void prepareGame(Participant participant, Set<Participant> participants,
                             JsonObject message, JsonObject params, JsonObject data) {
        // 참가자 수
        int number = participants.size();
        int gameId = data.get("gameId").getAsInt();

        // 순서 매핑
        Map<Integer, String> orderMap = new HashMap<>();
        Map<String, String> nickMap = new HashMap<>();

        // idx 순서 섞기
        int[] idxArr = new int[number];
        for (int i = 0; i < number; i++) {
            idxArr[i] = i+1;
        }
        System.out.println("idxArr: " + idxArr);
        int idx1, idx2;
        for (int i = 0; i < number; i++) {
            idx1 = (int) (Math.random()*number);
            idx2 = (int) (Math.random()*number);
            swap(idxArr, idx1, idx2);
        }
        // 순서 섞였는지 체크
        System.out.println("idxArr: " + idxArr);

        int idx = 0;
        for (Participant p : participants) {
            orderMap.put(idxArr[idx], p.getPublisherStreamId());
            nickMap.put(p.getPublisherStreamId(), "");
            idx++;
        }

        // 1번순서 => 키워드 입력하고 첫 그림 시작, 마지막 순서 => 문제를 맞춰야 함
        String sessionId = message.get("sessionId").getAsString();
        sNickMap.put(sessionId, nickMap);
        sOrderMap.put(sessionId, orderMap);
        
        // 나머지 게임은 '술래'가 따로 없음
        if(gameId == TAG) {
            List<Object> participantList = Arrays.asList(participants.toArray());
            Collections.shuffle(participantList);
            // 섞어서 0번쨰에 오는 사람의 streamId가 술래
            Participant target = (Participant) participantList.get(0);

            data.addProperty("streamId", target.getPublisherStreamId());
            data.addProperty("gameStatus", 2);
        } 

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

        int number = participants.size();
        int gameId = data.get("gameId").getAsInt();

        if (gameId == RELAY) {

        }else if (gameId == TAG) {

        }else if (gameId == BODY) {

        }


    }

    public void startGame(Participant participant, Set<Participant> participants,
                             JsonObject message, JsonObject params, JsonObject data) {

    }

    public void finishGame(Participant participant, Set<Participant> participants,
                           JsonObject message, JsonObject params, JsonObject data) {

    }


}
