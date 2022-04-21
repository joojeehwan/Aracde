package com.ssafy.arcade.user.response;

import com.ssafy.arcade.user.request.NaverProfile;
import lombok.Data;

@Data
public class NaverProfileResponse {

    // API 호출 결과 코드
    private String resultcode;

    // 호출 결과 메시지
    private String message;

    // Profile 상세
    private NaverProfile response;

}
