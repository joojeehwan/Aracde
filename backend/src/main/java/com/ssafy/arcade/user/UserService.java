package com.ssafy.arcade.user;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.arcade.common.exception.CustomException;
import com.ssafy.arcade.common.exception.ErrorCode;
import com.ssafy.arcade.common.util.JwtTokenUtil;
import com.ssafy.arcade.user.entity.Friend;
import com.ssafy.arcade.user.entity.User;
import com.ssafy.arcade.user.repository.FriendRepository;
import com.ssafy.arcade.user.repository.UserRepository;
import com.ssafy.arcade.user.request.KakaoProfile;
import com.ssafy.arcade.user.request.KakaoToken;
import com.ssafy.arcade.user.response.UserResDto;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    @Value("${kakao.client_id}")
    private String kakaoClientId;
    @Value("${kakao.redirect_uri}")
    private String kakaoRedirectUri;
    private final UserRepository userRepository;
    private final FriendRepository friendRepository;

    // refreshToken을 같이 담아 보낼수도 있음.
    public String getAccessToken(String code) {
        String accessToken = "";
        String refreshToken = "";
        String reqURL = "https://kauth.kakao.com/oauth/token";
        RestTemplate restTemplate = new RestTemplate();
        // 헤더 추가
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        // 바디 추가
        LinkedMultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("redirect_uri", kakaoRedirectUri);
        params.add("code", code);

        // HttpHeader와 HttpBody를 하나의 오브젝트에 담기
        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);
        // Http 요청하기 - Post방식으로 - 그리고 response 변수의 응답 받음.
        ResponseEntity<String> response = restTemplate.exchange(
                reqURL,
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class);
        // Gson, Json Simple, ObjectMapper
        ObjectMapper objectMapper = new ObjectMapper();
        KakaoToken kakaoToken = null;
        try {
            kakaoToken = objectMapper.readValue(response.getBody(), KakaoToken.class);
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return kakaoToken.getAccess_token();
    }

    public KakaoProfile getProfileByToken(String accessToken) {
        String reqURL = "https://kapi.kakao.com/v2/user/me";
        RestTemplate restTemplate = new RestTemplate();
        // HttpHeader 오브젝트 생성
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // HttpHeader와 HttpBody를 하나의 오브젝트에 담기
        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                reqURL,
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class);
        // Gson, Json Simple, ObjectMapper
        ObjectMapper objectMapper = new ObjectMapper();
        // 내가 필드로 선언한 데이터들만 파싱.
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,false);
        KakaoProfile kakaoProfile = null;
        try {
            kakaoProfile = objectMapper.readValue(response.getBody(), KakaoProfile.class);
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return kakaoProfile;
    }
    // 회원 가입
    public User signUp(String email, String image, String name) {
        User user = User.builder()
                .email(email).image(image).name(name).build();
        userRepository.save(user);
        return user;
    }

    // JWT 토큰으로 유저 조회
    public String getEmailByToken(String token) {
        JWTVerifier verifier = JwtTokenUtil.getVerifier();
        if ("".equals(token)) {
            throw new CustomException(ErrorCode.NOT_OUR_USER);
        }
        JwtTokenUtil.handleError(token);
        DecodedJWT decodedJWT = verifier.verify(token.replace(JwtTokenUtil.TOKEN_PREFIX, ""));
        return decodedJWT.getSubject();
    }

    // 유저 검색
    public UserResDto getUserByEmail(String token, String userEmail) {
        User me = userRepository.findByEmail(getEmailByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));

        User user = userRepository.findByEmail(userEmail).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        Friend targetfriend = friendRepository.findByRequestAndTarget(me, user).orElse(null);
        Friend reqfriend =  friendRepository.findByRequestAndTarget(user, me).orElse(null);

        Friend friend = targetfriend == null ? reqfriend : targetfriend;
        Integer status;
        if (friend == null) {
            status = -1;
        }
        else if (!friend.isApproved()) {
            status = 0;
        }
        else {
            status = 1;
        }
        UserResDto userResDto = new UserResDto();
        userResDto.setEmail(user.getEmail());
        userResDto.setName(user.getName());
        userResDto.setImage(user.getImage());
        userResDto.setStatus(status);

        return userResDto;
    }

    // 친구 요청
    public void requestFriend(String token, String targetEmail) {
        User reqUser = userRepository.findByEmail(getEmailByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));
        User targetUser = userRepository.findByEmail(targetEmail).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        Friend targetfriend = friendRepository.findByRequestAndTarget(reqUser, targetUser).orElse(null);
        Friend reqfriend =  friendRepository.findByRequestAndTarget(targetUser, reqUser).orElse(null);

        // 둘다 null이어야만 입력 가능
        if (targetfriend == null && reqfriend == null) {
            Friend friend = new Friend();

            friend.setRequest(reqUser);
            friend.setTarget(targetUser);
            friend.setApproved(false);
            friendRepository.save(friend);
        }
        else {
            throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
        }
    }
        
    // 친구 수락
    public void approveFriend(String token, String reqEmail) {
        User targetUser = userRepository.findByEmail(getEmailByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        User reqUser = userRepository.findByEmail(reqEmail).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        Friend targetFriend = friendRepository.findByRequestAndTarget(reqUser, targetUser).orElse(null);
        Friend reqFriend = friendRepository.findByRequestAndTarget(targetUser, reqUser).orElse(null);

        Friend friend = targetFriend == null ? reqFriend : targetFriend;
        // 요청한 친구관계가 없을떄
        if (friend == null) {
            throw new CustomException(ErrorCode.DATA_NOT_FOUND);
        }
        else {
            if (friend.isApproved()) {
                throw new CustomException(ErrorCode.ALREADY_ACCEPT);
            }
            friend.setApproved(true);
            friendRepository.save(friend);
        }
    }

    // 친구리스트 조회
    public List<UserResDto> getFriendList(String token) {
        User user = userRepository.findByEmail(getEmailByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));

        List<UserResDto> userResDtoList = new ArrayList<>();

        List<Friend> friendList = friendRepository.findAllByRequestOrTarget(user, user).orElse(null);
        if (friendList == null) {
            throw new CustomException(ErrorCode.NOT_OUR_USER);
        }

        for (Friend friend : friendList) {
            // 친구 수락 상태인 애들만
            if (!friend.isApproved()) {
                continue;
            }
            User friend_user = (friend.getRequest() == user) ? friend.getTarget() : friend.getRequest();
            UserResDto userResDto = new UserResDto();
            userResDto.setEmail(friend_user.getEmail());
            userResDto.setName(friend_user.getName());
            userResDto.setImage(friend_user.getImage());
            userResDto.setStatus(1);
            userResDtoList.add(userResDto);
        }
        return userResDtoList;
    }
    // 친구 검색
    public UserResDto searchFriend(String token, String userEmail) {
        User me = userRepository.findByEmail(getEmailByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        User user = userRepository.findByEmail(userEmail).orElseThrow(() ->
                new CustomException(ErrorCode.DATA_NOT_FOUND));

        Friend targetFriend = friendRepository.findByRequestAndTarget(me, user).orElse(null);
        Friend requestFriend = friendRepository.findByRequestAndTarget(user, me).orElse(null);

        Friend friend = targetFriend == null ? requestFriend : targetFriend;
        if (friend == null || !friend.isApproved()) {
            throw new CustomException(ErrorCode.DATA_NOT_FOUND);
        }
        UserResDto userResDto = new UserResDto();
        userResDto.setEmail(user.getEmail());
        userResDto.setName(user.getName());
        userResDto.setImage(user.getImage());
        userResDto.setStatus(1);
        return userResDto;
    }

    /**
     * 테스트용 Service
     */
    public void requestFriendTest(String fromEmail, String toEmail) {
        User reqUser = userRepository.findByEmail(fromEmail).get();
        User targetUser = userRepository.findByEmail(toEmail).get();

        Friend targetfriend = friendRepository.findByRequestAndTarget(reqUser, targetUser).orElse(null);
        Friend reqfriend =  friendRepository.findByRequestAndTarget(targetUser, reqUser).orElse(null);

        // 둘다 null이어야만 입력 가능
        if (targetfriend == null && reqfriend == null) {
            Friend friend = new Friend();

            friend.setRequest(reqUser);
            friend.setTarget(targetUser);
            friend.setApproved(false);
            friendRepository.save(friend);
        }
        else {
            throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
        }
    }
    public void approveFriendTest(String toEmail, String fromEmail) {
        User targetUser = userRepository.findByEmail(toEmail).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        User reqUser = userRepository.findByEmail(fromEmail).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        Friend targetFriend = friendRepository.findByRequestAndTarget(reqUser, targetUser).orElse(null);
        Friend reqFriend = friendRepository.findByRequestAndTarget(targetUser, reqUser).orElse(null);

        // 요청한 친구관계가 없을떄
        if (targetFriend == null && reqFriend == null) {
            throw new CustomException(ErrorCode.DATA_NOT_FOUND);
        }
        else {
            Friend friend = targetFriend == null ? reqFriend : targetFriend;

            if (friend.isApproved()) {
                throw new CustomException(ErrorCode.ALREADY_ACCEPT);
            }
            friend.setApproved(true);
            friendRepository.save(friend);
        }
    }

    // 친구리스트 조회
    public List<UserResDto> getFriendListTest(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        List<UserResDto> userResDtoList = new ArrayList<>();

        List<Friend> friendList = friendRepository.findAllByRequestOrTarget(user, user).orElse(null);
        if (friendList == null) {
            throw new CustomException(ErrorCode.NOT_OUR_USER);
        }

        for (Friend friend : friendList) {
            if (!friend.isApproved()) {
                continue;
            }
            User friend_user = (friend.getRequest() == user) ? friend.getTarget() : friend.getRequest();
            UserResDto userResDto = new UserResDto();
            userResDto.setEmail(friend_user.getEmail());
            userResDto.setName(friend_user.getName());
            userResDto.setImage(friend_user.getImage());

            userResDtoList.add(userResDto);
        }
        return userResDtoList;
    }

}
