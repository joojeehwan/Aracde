package com.ssafy.arcade.game;

import com.ssafy.arcade.common.exception.CustomException;
import com.ssafy.arcade.common.exception.ErrorCode;
import com.ssafy.arcade.common.s3.S3Service;
import com.ssafy.arcade.common.util.Code;
import com.ssafy.arcade.game.entity.Game;
import com.ssafy.arcade.game.entity.GameRoom;
import com.ssafy.arcade.game.entity.GameUser;
import com.ssafy.arcade.game.entity.Picture;
import com.ssafy.arcade.game.repositroy.GameRepository;
import com.ssafy.arcade.game.repositroy.GameRoomRepository;
import com.ssafy.arcade.game.repositroy.GameUserRepository;
import com.ssafy.arcade.game.repositroy.PictureRepository;
import com.ssafy.arcade.game.response.PictureResDto;
import com.ssafy.arcade.user.entity.User;
import com.ssafy.arcade.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final GameRoomRepository gameRoomRepository;
    private final GameUserRepository gameUserRepository;
    private final UserRepository userRepository;
    private final PictureRepository pictureRepository;
    private final S3Service s3Service;

    // Room 생성
    public String createInviteCode() {

        // 일단 무조건 요청하는대로 방 생성하는걸로

        String inviteCode = createRandString();
        // 혹시나 하는 중복 제거.
        while (true) {
            GameRoom gameRoom = gameRoomRepository.findByInviteCode(inviteCode).orElse(null);
            if (gameRoom == null) {
                break;
            }
            inviteCode = createRandString();
        }
        GameRoom gameRoom = GameRoom.builder().
                inviteCode(inviteCode).currentMember(1).build();
        gameRoomRepository.save(gameRoom);

        return inviteCode;
    }

    // 초대코드 일치여부 확인
    public void enterGameRoom(String inviteCode) {
        // 해당 inviteCode를 갖는 gameRoom이 존재하지 않는경우
        System.out.println("inviteCode: " + inviteCode);
        GameRoom gameRoom = gameRoomRepository.findByInviteCode(inviteCode).orElseThrow(() ->
                new CustomException(ErrorCode.UNMATHCED_CODE));

        Integer curMember = gameRoom.getCurrentMember();
        // 인원 초과 시,
        if (curMember >= 6) {
            throw new CustomException(ErrorCode.ALREADY_FULL);
        } else if (curMember < 0) {
            throw new CustomException(ErrorCode.ALREADY_EMPTY);
        }
        // 인원 추가
        gameRoom.addMember();
        gameRoomRepository.save(gameRoom);
    }
    public void exitGameRoom(String inviteCode) {
        GameRoom gameRoom = gameRoomRepository.findByInviteCode(inviteCode).orElseThrow(() ->
                new CustomException(ErrorCode.UNMATHCED_CODE));

        Integer curMember = gameRoom.getCurrentMember();
        if (curMember < 0) {
            throw new CustomException(ErrorCode.ALREADY_EMPTY);
        }
        gameRoom.delMember();
        gameRoomRepository.save(gameRoom);
    }

    // 방 삭제 (인원이 0명이 되면 실행하도록 구현)
//    public void deleteGameRoom(String inviteCode) {
//        GameRoom gameRoom = gameRoomRepository.findByInviteCodeAndIsDel(inviteCode, false).orElseThrow(() ->
//                new CustomException(ErrorCode.UNMATHCED_CODE));
//        boolean isDel = gameRoom.isDel();
//        // 이미 삭제된 데이터
//        if (isDel) {
//            throw new CustomException(ErrorCode.ALREADY_DELETE);
//        }
//        gameRoom.deleteRoom();
//        gameRoomRepository.save(gameRoom);
//    }

    // Game DB 생성
    public void createGame(Long userSeq, Code code) {
        User user = userRepository.findByUserSeq(userSeq).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        GameUser gameUser = gameUserRepository.findByUserAndGameCode(user, code).orElse(null);

        if (gameUser != null) {
            throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
        }
        // 모든 종류의 게임 DB를 생성
        Game game = Game.builder()
                .gameCnt(0).vicCnt(0).build();
        gameRepository.save(game);

        gameUser = GameUser.builder()
                .game(game).user(user).gameCode(code).build();

        gameUserRepository.save(gameUser);

    }
    // 게임 참가
    public void handleInitGame(Long userSeq, Integer codeIdx) {
        User user = userRepository.findByUserSeq(userSeq).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        boolean flag = false;
        for (Code code : Code.values()) {
            if (code.ordinal() == codeIdx) {
                GameUser gameUser = gameUserRepository.findByUserAndGameCode(user, code).orElseThrow(() ->
                        new CustomException(ErrorCode.DATA_NOT_FOUND));
                Game game = gameUser.getGame();
                game.addGameCnt();
                gameRepository.save(game);
                flag = true;
                break;
            }
        }
        System.out.println("flag: " + flag);
        // 유효하지 않은 code를 보낼 경우
        if (!flag) {
            throw new CustomException(ErrorCode.WRONG_DATA);
        }
    }
    // 게임 승리
    public void handleWinGame(Long userSeq, Integer codeIdx) {
        User user = userRepository.findByUserSeq(userSeq).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        boolean flag = false;
        for (Code code : Code.values()) {
            if (code.ordinal() == codeIdx) {
                GameUser gameUser = gameUserRepository.findByUserAndGameCode(user, code).orElseThrow(() ->
                        new CustomException(ErrorCode.DATA_NOT_FOUND));
                Game game = gameUser.getGame();
                if (game.getVicCnt() >= game.getGameCnt()) {
                    throw new CustomException(ErrorCode.WRONG_DATA);
                }
                game.addVicCnt();
                gameRepository.save(game);
                flag = true;
                break;
            }
        }
        // 유효하지 않은 code를 보낼 경우
        if (!flag) {
            throw new CustomException(ErrorCode.WRONG_DATA);
        }
    }
    // 그림 업로드
    public String uploadPicture(MultipartFile image) {
        // s3Service 바로 부르고싶다가도.. 아무래도 역시 이렇게 처리를 해주는게 나을 것 같아서
        String url = null;
        try {
            url = s3Service.uploadImg(image);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return url;
    }


    // 그림 저장
    public void createPicture(Long userSeq, String pictureUrl) {
        User user = userRepository.findByUserSeq(userSeq).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));

        Picture picture = pictureRepository.findByUserAndPictureUrlAndDelYn(user, pictureUrl, false).orElse(null);
        if (picture != null) {
            throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
        }
        picture = Picture.builder().pictureUrl(pictureUrl).delYn(false).user(user)
                .build();
        pictureRepository.save(picture);

    }
    // 그림 저장
    public void createPictures(Long userSeq, List<String> pictureUrlList) {
        User user = userRepository.findByUserSeq(userSeq).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));

        for (String pictureUrl : pictureUrlList) {
            Picture picture = pictureRepository.findByUserAndPictureUrlAndDelYn(user, pictureUrl, false).orElse(null);
            if (picture != null) {
                throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
            }
            picture = Picture.builder().pictureUrl(pictureUrl).delYn(false).user(user)
                    .build();
            pictureRepository.save(picture);
        }
    }
    // 그림 삭제
    public void deletePicture(Long userSeq, String pictureUrl) {
        User user = userRepository.findByUserSeq(userSeq).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        Picture picture = pictureRepository.findByUserAndPictureUrlAndDelYn(user, pictureUrl, false).orElseThrow(() ->
                new CustomException(ErrorCode.DATA_NOT_FOUND));
        picture.deletePicture();
        pictureRepository.save(picture);
    }
    
    // 10자리 임시 코드 생성
    protected String createRandString() {
        char[] temp = new char[10];
        for (int i = 0; i < temp.length; i++) {
            // 0 또는 1
            int div = (int)Math.floor(Math.random() * 3);
            // div가 0이면 숫자, 1이면 알파벳 대문자, 2이면 알파벳 소문자
            if (div == 0) {
                temp[i] = (char)(Math.random()*10 + '0');
            } else if (div == 1) {
                temp[i] = (char)(Math.random()*26 + 'A');
            } else {
                temp[i] = (char)(Math.random()*26 + 'a');
            }
        }
        return new String(temp);
    }
}
