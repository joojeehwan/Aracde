package com.ssafy.arcade.chat;

import com.ssafy.arcade.chat.dtos.request.SendMessageReq;
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

    @MessageMapping(value = "/chat/message")
    public void message(@Header("Authorization") String token, @RequestBody SendMessageReq sendMessageReq) {
        // 메시지가 들어오면 /sub/chat/room/룸아이디 로 메시지를 보낸다.
        chatService.sendMessage(token, sendMessageReq);
    }
}