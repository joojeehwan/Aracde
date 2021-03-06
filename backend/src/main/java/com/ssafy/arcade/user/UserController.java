package com.ssafy.arcade.user;

import com.ssafy.arcade.common.util.Code;
import com.ssafy.arcade.common.util.JwtTokenUtil;
import com.ssafy.arcade.game.GameService;
import com.ssafy.arcade.user.entity.User;
import com.ssafy.arcade.user.repository.UserRepository;
import com.ssafy.arcade.user.request.*;

import com.ssafy.arcade.user.response.ProfileResDto;
import com.ssafy.arcade.user.response.UserResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/apiv1/users")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final NaverLoginService naverLoginService;
    private final GoogleLoginService googleLoginService;
    private final GameService gameService;
    private final OnlineService onlineService;


    // 카카오 로그인
    // 인가코드를 받아온 후 부터 진행
    @GetMapping("/login")
    public ResponseEntity<Map<String, Object>> socialLogin(@RequestParam String code, @RequestParam String provider
            , @RequestParam String state) {
        User user = null;
        String email = null;
        String image = null;
        String name = null;
        if("KAKAO".equals(provider)){
            // 1. 인가 코드로 액세스 토큰을 받아온다.
            String accessToken = userService.getAccessToken(code);
            // 2. 액세스 토큰으로 카카오 정보를 가져온다.
            KakaoProfile kakaoProfile = userService.getProfileByToken(accessToken);
            // 3. 카카오 정보로 회원인지 아닌지 검사한다.
            user = userRepository.findByEmailAndProvider(kakaoProfile.getKakao_account().getEmail(), provider).orElseGet(User::new);
            // 카카오 정보를 email, image, name에 각각 입력
            email = kakaoProfile.getKakao_account().getEmail();
            image = kakaoProfile.getKakao_account().getProfile().getProfile_image_url();
            name = kakaoProfile.getKakao_account().getProfile().getNickname();
        }
        else if("NAVER".equals(provider)){
            String accessToken = naverLoginService.getAccessToken(code, state).getAccess_token();
            NaverProfile naverProfile = naverLoginService.getProfileByToken(accessToken);
            user = userRepository.findByEmailAndProvider(naverProfile.getResponse().getEmail(), provider).orElseGet(User::new);

            email = naverProfile.getResponse().getEmail();
            image = naverProfile.getResponse().getProfile_image();
            name = naverProfile.getResponse().getName();

        }
        else{

            GoogleToken googleToken = googleLoginService.getGoogleToken(code);
            GoogleProfile googleProfile = googleLoginService.getProfileByToken(googleToken);
            user = userRepository.findByEmailAndProvider(googleProfile.getEmail(), provider).orElseGet(User::new);

            email = googleProfile.getEmail();
            image = googleProfile.getPicture();
            name = googleProfile.getName();
        }

        // 3-1. 회원이 아니라면 회원가입 절차 진행
        // 이미 회원이라면 user가 null이 아님. 하지만 각 소셜마다 email, image, name을 가져왔으므로 그 정보들로 회원가입 진행.
        // 음.. DTO로 묶을까?
        Map<String, Object> map = new HashMap<>();
        if (user.getUserSeq() == null) {
            // 회원가입 후 토큰 발급
            user = userService.signUp(email,image,name,provider);

            // User 생성한 이후 바로 게임 DB 생성
            for (Code type : Code.values()) {
                gameService.createGame(user.getUserSeq(), type);
            }
        }
        // 4. 커스텀 토큰 발급
        map.put("token", "Bearer " + JwtTokenUtil.getToken(user.getUserSeq()));
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("image", user.getImage());
        map.put("userSeq", user.getUserSeq());
        // 5. 로그인 토픽에 추가
        onlineService.logined(user.getUserSeq());
        return new ResponseEntity<>(map, HttpStatus.OK);
    }

    // 유저 검색
    @GetMapping(value="/search")
    public ResponseEntity<List<UserResDto>> searchUser(@RequestHeader("Authorization") String token,
                                                       @RequestParam("name") String name) {


        List<UserResDto> userResDtoList = userService.getUserByName(token, name);

        return new ResponseEntity<>(userResDtoList, HttpStatus.OK);
    }

    // 친구 제외 유저 검색
    @GetMapping(value="/search/norelate")
    public ResponseEntity<List<UserResDto>> searchUserNoRelate(@RequestHeader("Authorization") String token,
                                                               @RequestParam("name") String name) {

        List<UserResDto> userResDtoList = userService.getUserByNameNoRelate(token, name);
        return new ResponseEntity<>(userResDtoList, HttpStatus.OK);
    }

    // 친구 요청
    @PostMapping(value= "/friend")
    public ResponseEntity<String> requestFriend(@RequestHeader("Authorization") String token,
                                                @RequestBody UserReqDto userReqDto) {
        Long userSeq = userReqDto.getUserSeq();
        userService.requestFriend(token, userSeq);
        return new ResponseEntity<>("친구 요청 성공", HttpStatus.OK);
    }

    // 친구 수락
    @PatchMapping(value = "/friend")
    public ResponseEntity<String> approveFriend(@RequestHeader("Authorization") String token,
                                                @RequestBody UserReqDto userReqDto) {
        Long userSeq = userReqDto.getUserSeq();
        userService.approveFriend(token, userSeq);
        return new ResponseEntity<>("친구 수락 성공", HttpStatus.OK);
    }

    // 친구 삭제
    @DeleteMapping(value = "/friend")
    public ResponseEntity<String> deleteFriend(@RequestHeader("Authorization") String token,
                                               @RequestBody UserReqDto userReqDto) {
        Long userSeq = userReqDto.getUserSeq();
        userService.deleteFriend(token, userSeq);
        return new ResponseEntity<>("친구 삭제 성공", HttpStatus.OK);
    }

    // 친구 목록 불러오기
    @GetMapping(value = "/friendList")
    public ResponseEntity<List<UserResDto>> friendList(@RequestHeader("Authorization") String token) {
        List<UserResDto> userResDtoList = userService.getFriendList(token);

        return new ResponseEntity<>(userResDtoList, HttpStatus.OK);
    }

    // 친구 검색
    @GetMapping(value = "/friend/search")
    public ResponseEntity<List<UserResDto>> friendSearch(@RequestHeader("Authorization") String token,
                                                         @RequestParam String name) {
        List<UserResDto> userResDtoList = userService.searchFriend(token, name);

        return new ResponseEntity<>(userResDtoList, HttpStatus.OK);
    }

    // 유저 프로필 불러오기
    @GetMapping(value = "/profile")
    public ResponseEntity<ProfileResDto> getProfile(@RequestHeader("Authorization") String token) {

        ProfileResDto profileResDto = userService.getUserProfile(token);

        return new ResponseEntity<>(profileResDto, HttpStatus.OK);
    }



}
