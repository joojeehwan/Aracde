package com.ssafy.arcade.user.response;

import com.ssafy.arcade.game.request.GameResDto;
import com.ssafy.arcade.game.response.PictureResDto;
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
    private Integer totalGameCnt;
    private Integer totalVicCnt;
    private List<GameResDto> gameResDtos;
    private List<PictureResDto> pictureResDtos;
}
