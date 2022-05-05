package com.ssafy.arcade.game.request;

import com.ssafy.arcade.common.util.Code;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class GameResDto {
    private Code gameCode;
    private Integer gameCnt;
    private Integer VicCnt;
}
