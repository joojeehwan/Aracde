package com.ssafy.arcade.notification.dtos;

import lombok.Builder;
import lombok.Data;

@Data
public class NotiDTO {
    private Long userSeq;
    private String name;
    private String inviteCode;
    private String type; // "room", "friend"

    @Builder
    public NotiDTO(Long userSeq, String name, String inviteCode, String type) {
        this.userSeq = userSeq;
        this.name = name;
        this.inviteCode = inviteCode;
        this.type = type;
    }
}
