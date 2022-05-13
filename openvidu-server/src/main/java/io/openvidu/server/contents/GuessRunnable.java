package io.openvidu.server.contents;

import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;

import java.util.Map;
import java.util.Set;

public class GuessRunnable implements Runnable {

    public boolean running = true;

    private Set<Participant> participants;
    private Map<Integer, String> orderMap;
    static RpcNotificationService rpcNotificationService;

    public GuessRunnable(Set<Participant> participants, Map<Integer, String> orderMap, RpcNotificationService rnfs) {
        this.participants = participants;
        this.orderMap = orderMap;
        this.rpcNotificationService = rnfs;
    }

    public void terminate() {
        running = false;
    }

    // 쓰레드 시작하면
    @Override
    public void run() {

    }
}
