package com.ssafy.arcade.chat.dtos.response;

import com.ssafy.arcade.messege.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SendMessageRes {
    // 추후에 토큰으로 통합
    private String name;
    private String content;
    private String image;
    private Long chatRoomSeq;
    private Type type;
    private String time;
    public enum Type{
        CHAT, NOTI
    }
}
