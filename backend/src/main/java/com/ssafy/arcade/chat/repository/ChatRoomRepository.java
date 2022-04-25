package com.ssafy.arcade.chat.repository;

import com.ssafy.arcade.chat.dtos.ChatRoomDTO;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.*;

@Repository
public class ChatRoomRepository {

    private Map<String, ChatRoomDTO> chatRoomDTOMap;
    // 추후 DB로 관리 예정
    // 의존성 주입이 끝난 상태에서 PostConstruct가 실행.

    @PostConstruct
    private void init(){
        chatRoomDTOMap = new LinkedHashMap<>();
    }
    // 모든 채팅방 리턴
    public List<ChatRoomDTO> findAllRooms(){
        //채팅방 생성 순서 최근 순으로 반환
        List<ChatRoomDTO> result = new ArrayList<>(chatRoomDTOMap.values());
        Collections.reverse(result);
        return result;
    }
    // 룸아이디로 방찾기
    public ChatRoomDTO findRoomById(String id){
        return chatRoomDTOMap.get(id);
    }
    // 채팅방 만들기. HashSet에 k-v로 저장된다.
    public ChatRoomDTO createChatRoomDTO(String name){
        ChatRoomDTO room = ChatRoomDTO.create(name);
        chatRoomDTOMap.put(room.getRoomId(), room);
        return room;
    }
    // 채팅방 제거
    public void deleteRoom(String id){
        chatRoomDTOMap.remove(id);
    }
}