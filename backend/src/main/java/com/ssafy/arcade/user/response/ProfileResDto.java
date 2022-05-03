package com.ssafy.arcade.user.response;

import com.ssafy.arcade.game.request.GameResDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class ProfileResDto {
    private Long userSeq;
    private String email;
    private String name;
    private String image;
    private List<GameResDto> gameResDtos;

}
