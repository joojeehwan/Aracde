package com.ssafy.arcade.chat.dtos.request;

import com.ssafy.arcade.messege.entity.Message;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
public class SendMessageReq {
    private Long chatRoomSeq;
    private String content;

    public Message toEntity(String profile, String name, Long sender) {
        return Message.builder().chatRoomSeq(chatRoomSeq).content(content)
                .profile(profile).name(name).time(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(LocalDateTime.now()))
                .sender(sender).build();
    }
}
