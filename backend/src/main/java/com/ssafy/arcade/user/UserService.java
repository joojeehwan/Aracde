package com.ssafy.arcade.user;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.arcade.chat.dtos.response.ChatRoomListDTO;
import com.ssafy.arcade.chat.entity.ChatRoom;
import com.ssafy.arcade.chat.repository.ChatRoomRepository;
import com.ssafy.arcade.common.RedisPublisher;
import com.ssafy.arcade.common.exception.CustomException;
import com.ssafy.arcade.common.exception.ErrorCode;
import com.ssafy.arcade.common.util.Code;
import com.ssafy.arcade.common.util.JwtTokenUtil;
import com.ssafy.arcade.game.GameService;
import com.ssafy.arcade.game.entity.Game;
import com.ssafy.arcade.game.entity.GameUser;
import com.ssafy.arcade.game.entity.Picture;
import com.ssafy.arcade.game.repositroy.GameUserRepository;
import com.ssafy.arcade.game.repositroy.PictureRepository;
import com.ssafy.arcade.game.request.GameReqDto;
import com.ssafy.arcade.game.request.GameResDto;
import com.ssafy.arcade.game.response.PictureResDto;
import com.ssafy.arcade.messege.entity.Message;
import com.ssafy.arcade.messege.repository.MessageRepository;
import com.ssafy.arcade.notification.dtos.NotiDTO;
import com.ssafy.arcade.notification.entity.Notification;
import com.ssafy.arcade.notification.repository.NotiRepository;
import com.ssafy.arcade.user.entity.Friend;
import com.ssafy.arcade.user.entity.User;
import com.ssafy.arcade.user.repository.FriendRepository;
import com.ssafy.arcade.user.repository.UserRepository;
import com.ssafy.arcade.user.request.KakaoProfile;
import com.ssafy.arcade.user.request.KakaoToken;
import com.ssafy.arcade.user.response.ProfileResDto;
import com.ssafy.arcade.user.response.UserResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
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
    private final SimpMessagingTemplate template;
    private final GameService gameService;
    private final GameUserRepository gameUserRepository;
    private final PictureRepository pictureRepository;
    private final NotiRepository notiRepository;
    private final RedisPublisher redisPublisher;
    private final SimpMessageSendingOperations messageTemplate;
    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;

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
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
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
    public User signUp(String email, String image, String name, String provider) {
        User user = User.builder()
                .email(email).image(image).name(name).provider(provider).build();
        userRepository.save(user);
        return user;
    }

    // JWT 토큰으로 유저 조회
//    public String getEmailByToken(String token) {
//        JWTVerifier verifier = JwtTokenUtil.getVerifier();
//        if ("".equals(token)) {
//            throw new CustomException(ErrorCode.NOT_OUR_USER);
//        }
//        JwtTokenUtil.handleError(token);
//        DecodedJWT decodedJWT = verifier.verify(token.replace(JwtTokenUtil.TOKEN_PREFIX, ""));
//        return decodedJWT.getSubject();
//    }
    // JWT 토큰으로 유저 조회
    public Long getUserSeqByToken(String token) {
        JWTVerifier verifier = JwtTokenUtil.getVerifier();
        if ("".equals(token)) {
            throw new CustomException(ErrorCode.NOT_OUR_USER);
        }
        JwtTokenUtil.handleError(token);
        DecodedJWT decodedJWT = verifier.verify(token.replace(JwtTokenUtil.TOKEN_PREFIX, ""));
        return Long.parseLong(decodedJWT.getSubject());
    }


    // 유저 검색
    public List<UserResDto> getUserByName(String token, String name) {
        User me = userRepository.findByUserSeq(getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));

        List<User> userList = userRepository.findByNameContains(name).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        List<UserResDto> userResDtoList = new ArrayList<>();
        for (User user : userList) {
            // 본인 제외
            if (user == me) {
                continue;
            }
            Friend targetfriend = friendRepository.findByRequestAndTarget(me, user).orElse(null);
            Friend reqfriend = friendRepository.findByRequestAndTarget(user, me).orElse(null);

            Friend friend = targetfriend == null ? reqfriend : targetfriend;
            Integer status;
            if (friend == null) {
                status = -1;
            } else if (!friend.isApproved()) {
                status = 0;
            } else {
                status = 1;
            }

            UserResDto userResDto = new UserResDto();
            userResDto.setUserSeq(user.getUserSeq());
            userResDto.setEmail(user.getEmail());
            userResDto.setName(user.getName());
            userResDto.setImage(user.getImage());
            userResDto.setStatus(status);

            userResDtoList.add(userResDto);
        }
        return userResDtoList;
    }

    // 친구 제외 유저 검색
    public List<UserResDto> getUserByNameNoRelate(String token, String name) {
        User me = userRepository.findByUserSeq(getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));

        List<User> userList = userRepository.findByNameContains(name).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        List<UserResDto> userResDtoList = new ArrayList<>();

        Integer status = 0;
        for (User user : userList) {
            // 본인 제외
            if (user == me) {
                continue;
            }
            Friend targetfriend = friendRepository.findByRequestAndTarget(me, user).orElse(null);
            Friend reqfriend = friendRepository.findByRequestAndTarget(user, me).orElse(null);

            Friend friend = targetfriend == null ? reqfriend : targetfriend;

            // 친구관계이나, 아직 상대가 수락 안한 상태
            if (friend != null && !friend.isApproved()) {
                status = 0;
            }

            if (friend == null) {
                status = -1;
            }
            UserResDto userResDto = new UserResDto();
            userResDto.setUserSeq(user.getUserSeq());
            userResDto.setEmail(user.getEmail());
            userResDto.setName(user.getName());
            userResDto.setImage(user.getImage());
            userResDto.setStatus(status);

            userResDtoList.add(userResDto);
        }
        return userResDtoList;
    }


    // 친구 요청
    public void requestFriend(String token, Long targetUserSeq) {
        User reqUser = userRepository.findByUserSeq(getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        User targetUser = userRepository.findByUserSeq(targetUserSeq).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        User user = userRepository.findByUserSeq(getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));


        Friend targetFriend = friendRepository.findByRequestAndTarget(reqUser, targetUser).orElse(null);
        Friend reqFriend = friendRepository.findByRequestAndTarget(targetUser, reqUser).orElse(null);

        // 본인 친구추가 불가
        if (targetUser == reqUser) {
            throw new CustomException(ErrorCode.CANNOT_FOLLOW_MYSELF);
        }
        // 둘다 null이어야만 입력 가능
        if (targetFriend == null && reqFriend == null) {
            Friend friend = new Friend();

            friend.setRequest(reqUser);
            friend.setTarget(targetUser);
            friend.setApproved(false);
            friendRepository.save(friend);
        } else {
            throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
        }
        // 알림 생성
        notiRepository.save(Notification.builder()
                .userSeq(user.getUserSeq()).type("Friend").targetSeq(targetUser.getUserSeq())
                .time(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(LocalDateTime.now()))
                .name(user.getName()).isConfirm(false).build());

        // 두개 이상일수도 있음; 친구 요청을 두번 이상 보낼수도 있으니까
        List<Notification> notifications = notiRepository.findAllByTypeAndUserSeqAndTargetSeq("Friend", user.getUserSeq(), targetUser.getUserSeq())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_DATA));
        // 리스트를 time 내림차순정렬
        notifications.sort((o1, o2) -> -o1.getTime().compareTo(o2.getTime()));
        // 가장 최근 noti 가져옴.
        Notification notification = notifications.get(0);
        // publish
        messageTemplate.convertAndSend("/sub/" + targetUser.getUserSeq(), NotiDTO.builder()
                .time(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(LocalDateTime.now()))
                .notiSeq(notification.getNotiSeq()).type("Friend").userSeq(user.getUserSeq()).name(user.getName())
                .isConfirm(false).build());
    }

    // 친구 수락
    public void approveFriend(String token, Long userSeq) {
        User targetUser = userRepository.findByUserSeq(getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        User reqUser = userRepository.findByUserSeq(userSeq).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        System.out.println("reqUser: " + reqUser + "targetUser: " + targetUser);
        if (targetUser == reqUser) {
            throw new CustomException(ErrorCode.CANNOT_FOLLOW_MYSELF);
        }
        Friend targetFriend = friendRepository.findByRequestAndTarget(reqUser, targetUser).orElse(null);

        // 수락할 때는 수락하는 user는 target에 저장된 경우여야만 한다.
        Friend reqFriend = friendRepository.findByRequestAndTarget(targetUser, reqUser).orElse(null);
        if (reqFriend != null) {
            throw new CustomException(ErrorCode.CANNOT_ACCEPT_MYSELF);
        }

        // 요청한 친구관계가 없을떄
        if (targetFriend == null) {
            throw new CustomException(ErrorCode.DATA_NOT_FOUND);
        } else {
            if (targetFriend.isApproved()) {
                throw new CustomException(ErrorCode.ALREADY_ACCEPT);
            }
            targetFriend.setApproved(true);
            friendRepository.save(targetFriend);
        }
    }

    // 친구 삭제, (상대가 수락하기 전이라면 친구 요청 취소인것)
    public void deleteFriend(String token, Long userSeq) {
        User reqUser = userRepository.findByUserSeq(getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        User targetUser = userRepository.findByUserSeq(userSeq).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        Friend targetFriend = friendRepository.findByRequestAndTarget(reqUser, targetUser).orElse(null);
        Friend reqFriend = friendRepository.findByRequestAndTarget(targetUser, reqUser).orElse(null);

        Friend friend = targetFriend == null ? reqFriend : targetFriend;
        if (friend == null) {
            throw new CustomException(ErrorCode.DATA_NOT_FOUND);
        } else {
            // 이미 친구인 경우에만 채팅방, 메시지 삭제
            if(friend.isApproved()){
                // 친구 삭제시 채팅방, 메시지 모두 삭제
                ChatRoom chatRoom = chatRoomRepository.findByUser1AndUser2(reqUser, targetUser).orElseGet(ChatRoom::new);
                if (chatRoom.getChatRoomSeq() == null) chatRoom = chatRoomRepository.findByUser1AndUser2(targetUser, reqUser).orElseGet(ChatRoom::new);
                List<Message> messages = new ArrayList<>();
                // 메시지 모두 삭제
                if(chatRoom.getChatRoomSeq() != null)
                messages = messageRepository.findAllByChatRoomSeq(chatRoom.getChatRoomSeq());
                if(messages.size()>0) {
                    messageRepository.deleteAll(messages);
                }

                // 채팅방 삭제
                if(chatRoom.getChatRoomSeq() != null) {
                    chatRoomRepository.delete(chatRoom);
                }
            }
            friendRepository.delete(friend);
        }
    }

    // 친구리스트 조회
    public List<UserResDto> getFriendList(String token) {
        User user = userRepository.findByUserSeq(getUserSeqByToken(token)).orElseThrow(() ->
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
            userResDto.setUserSeq(friend_user.getUserSeq());
            userResDto.setEmail(friend_user.getEmail());
            userResDto.setName(friend_user.getName());
            userResDto.setImage(friend_user.getImage());
            userResDto.setStatus(1);
            userResDtoList.add(userResDto);
        }
        return userResDtoList;
    }

    // 친구 검색
    public List<UserResDto> searchFriend(String token, String name) {
        User me = userRepository.findByUserSeq(getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        List<User> userList = userRepository.findByNameContains(name).orElseThrow(() ->
                new CustomException(ErrorCode.DATA_NOT_FOUND));

        List<UserResDto> userResDtoList = new ArrayList<>();
        for (User user : userList) {
            Friend targetFriend = friendRepository.findByRequestAndTarget(me, user).orElse(null);
            Friend requestFriend = friendRepository.findByRequestAndTarget(user, me).orElse(null);

            Friend friend = targetFriend == null ? requestFriend : targetFriend;
            // 친구가 아니거나, 아직 수락전이면 제외
            if (friend == null || !friend.isApproved()) {
                continue;
            }
            UserResDto userResDto = new UserResDto();
            userResDto.setUserSeq(user.getUserSeq());
            userResDto.setEmail(user.getEmail());
            userResDto.setName(user.getName());
            userResDto.setImage(user.getImage());
            userResDto.setStatus(1);

            userResDtoList.add(userResDto);

        }
        return userResDtoList;
    }

    // 유저 프로필
    public ProfileResDto getUserProfile(String token) {
        User user = userRepository.findByUserSeq(getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));


        // 게임별 gameResDto 추가
        List<GameResDto> gameResDtos = new ArrayList<>();
        int totalGameCnt = 0;
        int totalVicCnt = 0;


        for (Code code : Code.values()) {
            GameUser gameUser = gameUserRepository.findByUserAndGameCode(user, code).orElse(null);
            // 만약 gameUser가 없는경우는 생성한 후에 다시 조회 (예외처리 개념)
            if (gameUser == null) {
                gameService.createGame(user.getUserSeq(), code);
                gameUser = gameUserRepository.findByUserAndGameCode(user, code).orElseThrow(() ->
                        new CustomException(ErrorCode.WRONG_DATA));
            }
            Game game = gameUser.getGame();

            GameResDto gameResDto = new GameResDto();

            int gameCnt = game.getGameCnt();
            int vicCnt = game.getVicCnt();
            gameResDto.setGameCode(gameUser.getGameCode());
            gameResDto.setGameCnt(gameCnt);
            gameResDto.setVicCnt(vicCnt);
            gameResDtos.add(gameResDto);

            totalGameCnt += gameCnt;
            totalVicCnt += vicCnt;
        }
        // 저장된 그림 추가
        List<PictureResDto> pictureResDtos = new ArrayList<>();
        List<Picture> pictureList = pictureRepository.findAllByUserAndDelYn(user, false).orElse(null);
        // 있을때만 추가
        if (pictureList != null) {
            for (Picture picture : pictureList) {
                PictureResDto pictureResDto = new PictureResDto();
                pictureResDto.setPictureUrl(picture.getPictureUrl());
                pictureResDto.setCreatedDate(picture.getCreatedDate());

                pictureResDtos.add(pictureResDto);
            }
        }

        // profileResDto에 전부 저장
        ProfileResDto profileResDto = new ProfileResDto();

        profileResDto.setUserSeq(user.getUserSeq());
        profileResDto.setEmail(user.getEmail());
        profileResDto.setName(user.getName());
        profileResDto.setImage(user.getImage());
        profileResDto.setGameResDtos(gameResDtos);
        profileResDto.setPictureResDtos(pictureResDtos);
        profileResDto.setTotalGameCnt(totalGameCnt);
        profileResDto.setTotalVicCnt(totalVicCnt);

        return profileResDto;
    }
}
