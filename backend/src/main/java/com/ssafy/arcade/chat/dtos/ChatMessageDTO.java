package com.ssafy.arcade.chat.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class ChatMessageDTO {

    private String roomId;
    private String writer;
    private String message;


}