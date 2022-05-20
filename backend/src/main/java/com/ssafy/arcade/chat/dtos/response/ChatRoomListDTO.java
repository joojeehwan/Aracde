package com.ssafy.arcade.chat.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ChatRoomListDTO {
    Long chatRoomSeq;
    String name;
    String image;
    String lastMessage;
    String lastTime;
    boolean login;
}
