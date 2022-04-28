package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;
import org.springframework.security.core.parameters.P;

import javax.servlet.http.Part;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class GameService {

    /** 게임 상태 */
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

    /** 게임 종류*/
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



    public void controlGame(Participant participant, JsonObject message, Set<Participant> participants,
                            RpcNotificationService rnfs) {
        rpcNotificationService = rnfs;

        JsonObject params = new JsonObject();

        if (participant != null) {
            params.addProperty(ProtocolElements.PARTICIPANTSENDMESSAGE_FROM_PARAM,
                    participant.getParticipantPublicId());
        }

        if (message.has("type")) {
            params.addProperty(ProtocolElements.PARTICIPANTSENDMESSAGE_TYPE_PARAM, message.get("type").getAsString());
        }

        String dataString = message.get("data").getAsString();
        JsonObject data = (JsonObject) JsonParser.parseString(dataString);

        int gameStatus = data.get("gameStatus").getAsInt();

        data.addProperty("gameStatus", gameStatus);

        switch (gameStatus) {
            case NOGAME:
                noGame(participant, participants, message, params, data);
                break;
            case PREPAREGAME:
                break;
            case SELECTGAME:
                break;
            case STARTGAME:
                break;
            case FINISHGAME:
                break;
        }
    }

    private void noGame(Participant participant, Set<Participant> participants,
                        JsonObject message, JsonObject params, JsonObject data) {
        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                        ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    }


}
