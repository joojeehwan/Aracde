package com.ssafy.arcade.chat.repository;

import com.ssafy.arcade.chat.entity.ChatRoom;
import com.ssafy.arcade.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByUser1AndUser2(User user1, User user2);
    Optional<ChatRoom> findByChatRoomSeq(Long chatRoomSeq);
}
