package com.ssafy.arcade.chat.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageDTO {

    private String roomId;
    private String writer;
    private String message;

    @Override
    public String toString() {
        return "ChatMessageDTO{" +
                "roomId='" + roomId + '\'' +
                ", writer='" + writer + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}