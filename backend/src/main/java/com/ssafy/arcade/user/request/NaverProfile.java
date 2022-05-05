package com.ssafy.arcade.user.request;

import lombok.Data;

@Data
public class NaverProfile {
    public Response response;
    @Data
    public class Response {
        // 동일인 식별 정보는 네이버 아이디마다 고유하게 발급되는 값입니다.
        private String id;
        // 사용자 이름 (네이버의 경우 별명이 없으면 임의의 id 값이 온다고함.)
        private String name;
        // 	사용자 메일 주소
        private String email;
        // 사용자 프로필 사진 URL
        private String profile_image;
    }
}
