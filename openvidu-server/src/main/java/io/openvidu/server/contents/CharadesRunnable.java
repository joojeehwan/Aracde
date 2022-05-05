package io.openvidu.server.contents;

import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;

import java.util.Set;

public class CharadesRunnable implements Runnable{

    static RpcNotificationService rpcNotificationService;
    private Set<Participant> participants;

    public CharadesRunnable(Set<Participant> participants, RpcNotificationService rnfs) {
        this.participants = participants;
        rpcNotificationService = rnfs;

    }


    @Override
    public void run() {

    }
}
