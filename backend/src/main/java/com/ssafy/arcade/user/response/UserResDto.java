package com.ssafy.arcade.user.response;

import com.ssafy.arcade.user.entity.User;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserResDto {
    String email;
    String name;
    String image;

    @Builder
    public UserResDto(User user) {
        this.email = user.getEmail();
        this.name = user.getName();
        this.image = user.getImage();
    }
}
