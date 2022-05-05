package com.ssafy.arcade.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.arcade.user.repository.UserRepository;
import com.ssafy.arcade.user.request.NaverProfile;
import com.ssafy.arcade.user.request.NaverToken;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NaverLoginService {

    @Value("${naver.client_id}")
    private String naverClientId;

    @Value("${naver.client_secret}")
    private String naverClientSecret;

    @Value("${naver.redirect_uri}")
    private String naverRedirectUri;

    /**
     * @description Naver 로그인을 위하여 Access_tokin을 발급받음
     *
     * state는, 프론트에서 API 인증 요청 때 생성한 문자열
     */
    public NaverToken getAccessToken(String code, String state){
        String accessToken = "";
        String refreshToken = "";
        String reqURL = "https://nid.naver.com/oauth2.0/token";

        RestTemplate restTemplate = new RestTemplate();
        // 헤더 추가
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/xml");

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(reqURL)
                .queryParam("grant_type", "authorization_code")
                .queryParam("client_id", naverClientId)
                .queryParam("client_secret", naverClientSecret)
                .queryParam("code", code)
                .queryParam("state", state);

        // HttpHeader와 HttpBody를 하나의 오브젝트에 담기
        HttpEntity<MultiValueMap<String, String>> naverTokenRequest = new HttpEntity<>(headers);


        // Http 요청하기 - Post방식으로 - 그리고 response 변수의 응답 받음.
        ResponseEntity<String> response = restTemplate.exchange(
                    builder.toUriString(), HttpMethod.POST, naverTokenRequest, String.class);

        ObjectMapper objectMapper = new ObjectMapper();
        NaverToken naverToken = null;
        try {
            naverToken = objectMapper.readValue(response.getBody(), NaverToken.class);
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return naverToken;
    }

    // ----- 프로필 API 호출 (Unique한 id 값을 가져오기 위함) -----
    public NaverProfile getProfileByToken(String accessToken){
        String reqURL = "https://openapi.naver.com/v1/nid/me";

        RestTemplate restTemplate = new RestTemplate();
        // HttpHeader 오브젝트 생성
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-Type", "application/xml");


        HttpEntity<MultiValueMap<String, String>> naverTokenRequest = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                reqURL, HttpMethod.POST, naverTokenRequest, String.class);

        ObjectMapper objectMapper = new ObjectMapper();
        // 내가 필드로 선언한 데이터들만 파싱.
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,false);

        NaverProfile naverProfile = null;
        try {
            naverProfile = objectMapper.readValue(response.getBody(), NaverProfile.class);
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        System.out.println("naverProfile: " + naverProfile);
        return naverProfile;
    }

}
