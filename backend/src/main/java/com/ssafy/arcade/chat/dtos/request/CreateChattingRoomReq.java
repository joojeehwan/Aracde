package com.ssafy.arcade.chat.dtos.request;

import com.ssafy.arcade.chat.entity.ChatRoom;
import com.ssafy.arcade.user.entity.User;
import lombok.Data;

@Data
public class CreateChattingRoomReq {
    private Long targetUserSeq;

    public ChatRoom toEntity(User user1, User user2){
        return ChatRoom.builder()
                .user1(user1).user2(user2)
                .lastContent("").lastTime(null).build();
    }

}
