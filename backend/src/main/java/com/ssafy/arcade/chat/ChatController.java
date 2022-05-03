package com.ssafy.arcade.chat;

import com.ssafy.arcade.chat.dtos.ChatMessageDTO;
import com.ssafy.arcade.chat.dtos.ChatRoomDTO;
import com.ssafy.arcade.chat.dtos.request.CreateChattingRoomReq;
import com.ssafy.arcade.chat.dtos.request.SendMessageReq;
import com.ssafy.arcade.chat.repository.ChatRoomRepository;
import com.ssafy.arcade.common.RedisPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/apiv1/chat")
public class ChatController {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatService chatService;
    private final SimpMessagingTemplate template; //특정 Broker로 메세지를 전달
    private final RedisPublisher redisPublisher;

    // 1. 1:1 채팅방 만들기
    @PostMapping("/create")
    public ResponseEntity<String> createChattingRoom(@RequestHeader("Authorization") String token, @RequestBody CreateChattingRoomReq createChattingRoomReq) {
        return new ResponseEntity<>(chatService.createChattingRoom(token, createChattingRoomReq), HttpStatus.OK);
    }
    // 2. 채팅방에 메시지 전송하기
    @PostMapping("/message")
    public ResponseEntity<String> sendMessage(@RequestHeader("Authorization") String token, @RequestBody SendMessageReq sendMessageReq) {
        return new ResponseEntity<>(chatService.sendMessage(token, sendMessageReq), HttpStatus.OK);
    }
}