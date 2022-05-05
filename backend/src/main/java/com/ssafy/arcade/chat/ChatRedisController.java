package com.ssafy.arcade.chat;

//import com.ssafy.arcade.chat.dtos.request.SendMessageReq;
import com.ssafy.arcade.common.RedisPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@CrossOrigin("*")
@RequiredArgsConstructor
public class ChatRedisController {
    private final ChatService chatService;
    private final RedisPublisher redisPublisher;

    //Client가 SEND할 수 있는 경로
    //stompConfig에서 설정한 applicationDestinationPrefixes와 @MessageMapping 경로가 병합됨
    //"/pub/chat/enter"
//    @MessageMapping(value = "/chat/enter")
//    public void enter(String token, ) {
//        System.out.println("채팅방에 입장했다.");
//        chatService.sendMessage(token, sendMessageReq);
//    }

//    @MessageMapping(value = "/chat/message")
//    public void message(@Header("Authorization") String token, @RequestBody SendMessageReq sendMessageReq) {
//        // 메시지가 들어오면 /sub/chat/room/룸아이디 로 메시지를 보낸다.
//        chatService.sendMessage(token, sendMessageReq);
//    }
}