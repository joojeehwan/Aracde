package com.ssafy.arcade.chat;

import com.ssafy.arcade.chat.dtos.response.ChatRoomListDTO;
import com.ssafy.arcade.chat.dtos.request.CreateChattingRoomReq;
import com.ssafy.arcade.chat.dtos.response.SearchFriendRes;
import com.ssafy.arcade.chat.repository.ChatRoomRepository;
import com.ssafy.arcade.messege.entity.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin("*")
@RequiredArgsConstructor
public class ChatController {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatService chatService;

    // 1. 채팅방 목록 가져오기
    @GetMapping
    public ResponseEntity<List<ChatRoomListDTO>> getChattingRoom(@RequestHeader("Authorization") String token) {
        return new ResponseEntity<>(chatService.getChattingRoom(token), HttpStatus.OK);
    }
    // 2. 1:1 채팅방 만들기
    @PostMapping("/create")
    public ResponseEntity<String> createChattingRoom(@RequestHeader("Authorization") String token, @RequestBody CreateChattingRoomReq createChattingRoomReq) {
        return new ResponseEntity<>(chatService.createChattingRoom(token, createChattingRoomReq), HttpStatus.OK);
    }
    // 3. 채팅방 입장하기
    @GetMapping("/enter")
    public ResponseEntity<List<Message>> enterChattingRoom(@RequestParam("chatRoomSeq") Long chatRoomSeq) {
        return new ResponseEntity<>(chatService.enterChattingRoom(chatRoomSeq), HttpStatus.OK);
    }
    // 4. 대화 상대 검색하기
    @GetMapping("/search")
    public ResponseEntity<List<SearchFriendRes>> searchFriend(@RequestParam("name") String name, @RequestHeader("Authorization") String token) {
        return new ResponseEntity<>(chatService.searchFriend(token,name), HttpStatus.OK);
    }
//    // 2. 채팅방에 메시지 전송하기
//    @PostMapping("/message")
//    public ResponseEntity<String> sendMessage(@RequestHeader("Authorization") String token, @RequestBody SendMessageReq sendMessageReq) {
//        return new ResponseEntity<>(chatService.sendMessage(token, sendMessageReq), HttpStatus.OK);
//    }
//    @PostMapping("/test/create")
//    public ResponseEntity<ChatRoom> testCreateChattingRoom(@RequestBody CreateChattingRoomReq createChattingRoomReq) {
//
//        return new ResponseEntity<>(chatService.testCreateChattingRoom(createChattingRoomReq), HttpStatus.OK);
//    }
//    // 테스트용
//    @PostMapping("/test/message")
//    public ResponseEntity<SendMessageRes> testSendMessage(@RequestBody SendMessageReq sendMessageReq) {
//        return new ResponseEntity<>(chatService.testSendMessage(sendMessageReq), HttpStatus.OK);
//    }
//    // 테스트용 방 입장
//    @GetMapping("/test/enter")
//    public ResponseEntity<String> testEnter(@RequestParam Long chatRoomSeq) {
//        return new ResponseEntity<>(chatService.testEnter(chatRoomSeq), HttpStatus.OK);
//    }
}