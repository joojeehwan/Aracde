package com.ssafy.arcade.chat.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ChatRoomListDTO {
    Long chatRoomSeq;
    String name;
    String image;
    String lastMessage;
    LocalDate lastTime;
}
