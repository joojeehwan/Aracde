package com.ssafy.arcade.game.request;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class GameReqDto {
    // 백에서 Code로 치환 1이면 G01 / 2면 G02
    private Integer gameCode;
    private String userEmail;

}
