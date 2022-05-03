package com.ssafy.arcade.chat.dtos.request;

import com.ssafy.arcade.messege.entity.Message;
import lombok.Data;

@Data
public class SendMessageReq {
    private Long chatRoomSeq;
    private String content;

    public Message toEntity(String profile,String name,Long sender){
        return Message.builder().chatRoomSeq(chatRoomSeq).content(content)
                .profile(profile).name(name)
                .sender(sender).build();
    }
}
