package com.ssafy.arcade.chat;

import com.ssafy.arcade.chat.dtos.ChatRoomDTO;
import com.ssafy.arcade.chat.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/chat")
@Log4j2
public class RoomController {

    private final ChatRoomRepository chatRoomRepository;

    // 1. 전체 채팅 목록 조회.
    @GetMapping(value = "/rooms")
    public List<ChatRoomDTO> rooms() {
        return chatRoomRepository.findAllRooms();
    }

    // 2. 채팅방 개설
    @PostMapping(value = "/room")
    public void create() {
        log.info("# Create Chat Room , name: " + "채팅방 이름");
        log.info("채팅방 목록 ----");
        System.out.println(rooms());
        chatRoomRepository.createChatRoomDTO("채팅방 이름");
    }

    // 3. 채팅방 조회
    @GetMapping(value = "/room/{roomId}")
    public ChatRoomDTO getRoom(String roomId) {
        return chatRoomRepository.findRoomById(roomId);
    }

    // 4. 채팅방 삭제
    @DeleteMapping(value = "/room/{roomId}")
    public void deleteRoom(@PathVariable String roomId){
        chatRoomRepository.deleteRoom(roomId);
    }
}