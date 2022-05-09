package com.ssafy.arcade.game.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class PictureReqDto {
    private Long userSeq;
    private List<String> pictureUrls;
}
