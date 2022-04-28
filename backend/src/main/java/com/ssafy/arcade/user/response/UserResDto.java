package com.ssafy.arcade.user.response;

import com.ssafy.arcade.user.entity.User;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserResDto {
    Long userSeq;
    String email;
    String name;
    String image;
    // -1이면 아무관계도 아닌것, 0이면 친구요청만 된 상태,  1이면 친구
    Integer status;

    @Builder
    public UserResDto(User user) {
        this.email = user.getEmail();
        this.name = user.getName();
        this.image = user.getImage();
    }
}
