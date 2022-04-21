package com.ssafy.arcade.user.request;

import lombok.Data;

@Data
public class NaverProfile {

    // 동일인 식별 정보는 네이버 아이디마다 고유하게 발급되는 값입니다.
    private String id;
    // 사용자 별명
    private String nickname;
    // 	사용자 메일 주소
    private String email;
    // 사용자 프로필 사진 URL
    private String profile_image;
}
