package com.ssafy.arcade.user.request;

import lombok.Builder;
import lombok.Data;

@Data
public class GoogleProfile {
    private String name;
    private String email;
    private String picture;

    @Builder
    public GoogleProfile(String name, String email, String picture) {
        this.name = name;
        this.email = email;
        this.picture = picture;
    }
}
