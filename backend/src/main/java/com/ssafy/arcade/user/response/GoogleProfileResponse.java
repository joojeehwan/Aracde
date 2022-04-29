package com.ssafy.arcade.user.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class GoogleProfileResponse implements Serializable {
    private String name;
    private String email;
    private String picture;
}
