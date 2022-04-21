package com.ssafy.arcade.user;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.arcade.common.exception.CustomException;
import com.ssafy.arcade.common.exception.ErrorCode;
import com.ssafy.arcade.common.util.JwtTokenUtil;
import com.ssafy.arcade.user.request.GoogleProfile;
import com.ssafy.arcade.user.request.GoogleToken;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;


@RequiredArgsConstructor
@Service
public class GoogleLoginService {
    @Value("${google.client_id}")
    private String googleClientId;
    @Value("${google.client_secret}")
    private String googleClientSecret;
    @Value("${google.redirect_uri}")
    private String redirectUri;

    public GoogleToken getGoogleToken(String code) {
        String reqURL = "https://oauth2.googleapis.com/token";
        RestTemplate restTemplate = new RestTemplate();
        // 헤더 추가
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        // 바디 추가
        LinkedMultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", googleClientId);
        body.add("client_secret", googleClientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("grant_type", "authorization_code");

        // HttpHeader와 HttpBody를 하나의 오브젝트에 담기
        HttpEntity<MultiValueMap<String, String>> googleTokenRequest = new HttpEntity<>(body, headers);
        // Http 요청하기 - Post방식으로 - 그리고 response 변수의 응답 받음.
        ResponseEntity<String> response = restTemplate.exchange(
                reqURL,
                HttpMethod.POST,
                googleTokenRequest,
                String.class);
        // Gson, Json Simple, ObjectMapper
        ObjectMapper objectMapper = new ObjectMapper();
        GoogleToken googleToken = null;
        try {
            googleToken = objectMapper.readValue(response.getBody(), GoogleToken.class);
            System.out.println(googleToken);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return googleToken;
    }

    public GoogleProfile getProfileByToken(GoogleToken googleToken) {
        String idToken = googleToken.getId_token();
        String[] parsedToken = idToken.split("\\.");

        Base64.Decoder decoder = Base64.getUrlDecoder();

//        String header = new String(decoder.decode(parsedToken[0]));
        String payload = new String(decoder.decode(parsedToken[1]));

        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> decodeIdToken = new HashMap<>();
        try {
            Map<String, String> decodeMap = mapper.readValue(payload, Map.class);
            decodeIdToken = decodeMap;
        }
        catch (IOException e) {
            e.printStackTrace();
        }

        return GoogleProfile.builder()
                .name(decodeIdToken.get("name"))
                .email(decodeIdToken.get("email"))
                .picture(decodeIdToken.get("picture"))
                .build();
    }

}
