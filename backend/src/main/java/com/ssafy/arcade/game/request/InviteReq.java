package com.ssafy.arcade.game.request;


import lombok.*;

@Data
public class InviteReq {
    private String inviteCode;
    private Long userSeq;
    private Long targetSeq;

}
