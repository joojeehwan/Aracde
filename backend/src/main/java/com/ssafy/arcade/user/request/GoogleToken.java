package com.ssafy.arcade.user.request;

import lombok.Data;

@Data
public class GoogleToken {
    private String access_token;
    private String expires_in;
    private String id_token;
    private String scope;
    private String token_type;
    private String refresh_token;
}
