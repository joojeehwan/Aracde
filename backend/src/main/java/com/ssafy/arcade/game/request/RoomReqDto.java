package com.ssafy.arcade.game.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class RoomReqDto {
    private String inviteCode;
}
