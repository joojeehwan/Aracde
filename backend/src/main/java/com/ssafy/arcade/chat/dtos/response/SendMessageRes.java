package com.ssafy.arcade.chat.dtos.response;

import com.ssafy.arcade.messege.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class SendMessageRes {
    // 추후에 토큰으로 통합
    private String name;
    private String content;
    private String image;
    private Long chatRoomSeq;

    public Message toEntity(Long chatRoomSeq, String image, String name, Long sender){
        return Message.builder().chatRoomSeq(chatRoomSeq).content(content)
                .profile(image).name(name)
                .sender(sender).build();
    }
}
