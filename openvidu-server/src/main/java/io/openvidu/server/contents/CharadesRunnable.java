package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;

import java.util.ArrayList;
import java.util.Map;
import java.util.Set;

public class CharadesRunnable implements Runnable{

    static RpcNotificationService rpcNotificationService;
    private Map<Integer, String> peopleOrder;
    private ArrayList<String> wordList;
    private Set<Participant> participants;
    private JsonObject data;
    private JsonObject params;

    public CharadesRunnable(Map<Integer, String> peopleOrder, ArrayList<String> wordList, JsonObject data, JsonObject params, Set<Participant> participants, RpcNotificationService rnfs) {
        this.peopleOrder = peopleOrder;
        this.wordList = wordList;
        this.participants = participants;
        this.data = data;
        this.params = params;
        rpcNotificationService = rnfs;
    }


    @Override
    public void run() {
        // 출제자 & 정답 정하기
        int nowTurn = data.get("idx").getAsInt();
        String curStreamId = peopleOrder.get(nowTurn);
        String answer = wordList.get(nowTurn);

        data.addProperty("curStreamId", curStreamId);
        data.addProperty("answer", answer);

        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    }
}
