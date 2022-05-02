package com.ssafy.arcade.chat.repository;

import com.ssafy.arcade.chat.dtos.ChatRoomDTO;
import com.ssafy.arcade.chat.entity.ChatRoom;
import com.ssafy.arcade.notification.entity.Notification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.*;

public interface ChatRoomRepository extends CrudRepository<ChatRoom, String> {
}
