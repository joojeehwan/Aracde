package com.ssafy.arcade.chat;

import com.ssafy.arcade.chat.dtos.ChatMessageDTO;
import com.ssafy.arcade.common.RedisPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin("*")
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate template; //특정 Broker로 메세지를 전달
    private final RedisPublisher redisPublisher;

    //Client가 SEND할 수 있는 경로
    //stompConfig에서 설정한 applicationDestinationPrefixes와 @MessageMapping 경로가 병합됨
    //"/pub/chat/enter"
    @MessageMapping(value = "/chat/enter")
    public void enter(ChatMessageDTO message) {
        System.out.println("채팅방에 입장했다.");
        message.setMessage(message.getWriter() + "님이 채팅방에 참여하였습니다.");
        template.convertAndSend("/sub/chat/room/" + message.getRoomId(), message);
    }

    @MessageMapping(value = "/chat/message")
    public void message(ChatMessageDTO message) {
        System.out.println("채팅방에 메시지를 보냈다.");
        System.out.println(message);
        // 메시지가 들어오면 /sub/chat/room/룸아이디 로 메시지를 보낸다.
        template.convertAndSend("/sub/chat/room/" + message.getRoomId(), message);
    }
    @MessageMapping("/join")
    public void joinUser(){
        System.out.println("누군가가 들어왔다");
    }
}