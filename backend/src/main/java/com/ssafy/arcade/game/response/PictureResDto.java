package com.ssafy.arcade.game.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.apache.tomcat.jni.Local;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class PictureResDto {
    private String pictureUrl;
    private LocalDateTime createdDate;

}
