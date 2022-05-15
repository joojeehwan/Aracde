package com.ssafy.arcade.game;


import com.ssafy.arcade.game.request.GameReqDto;
import com.ssafy.arcade.game.request.PictureReqDto;
import com.ssafy.arcade.game.request.RoomReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/apiv1/game")
public class GameController {

    private final GameService gameService;

    /**
     *  GameRoom 관련 Controller
     * */
    @PostMapping(value="/room")
    public ResponseEntity<Map<String, String>> createRoom() {

        String inviteCode = gameService.createInviteCode();
        Map<String, String> map = new HashMap<>();
        map.put("inviteCode", inviteCode);

        return new ResponseEntity<>(map, HttpStatus.OK);
    }

    @PatchMapping(value="/room")
    public ResponseEntity<String> enterRoom(@RequestBody RoomReqDto roomReqDto) {

        gameService.enterGameRoom(roomReqDto.getInviteCode());

        return new ResponseEntity<>("초대코드 일치 확인", HttpStatus.OK);
    }

    @PatchMapping(value="/exit")
    public ResponseEntity<String> exitRoom(@RequestBody RoomReqDto roomReqDto) {
        gameService.exitGameRoom(roomReqDto.getInviteCode());
        return new ResponseEntity<>("방 나감 처리 완료", HttpStatus.OK);
    }

    /**
     *  Game 관련 Controller
     * */
    @PatchMapping(value="/win")
    public ResponseEntity<String> winGame(@RequestBody GameReqDto gameReqDto) {

        gameService.handleWinGame(gameReqDto.getUserSeq(), gameReqDto.getCodeIdx());
        return new ResponseEntity<>("요청 성공", HttpStatus.OK);
    }
    @PatchMapping(value="/init")
    public ResponseEntity<String> initGame(@RequestBody GameReqDto gameReqDto) {


        gameService.handleInitGame(gameReqDto.getUserSeq(), gameReqDto.getCodeIdx());
        return new ResponseEntity<>("요청 성공", HttpStatus.OK);
    }

    // 그림 S3 업로드
    @PostMapping(value="/upload",consumes = {"multipart/form-data", "application/json"})
    public ResponseEntity<String> uploadPicture(@RequestPart(value = "image") MultipartFile image) {
        return new ResponseEntity<>(gameService.uploadPicture(image), HttpStatus.OK);
    }

    // 캐치마인드 끝나고 원하는 그림 추가 (개별 추가)
    @PostMapping(value="/picture")
    public ResponseEntity<String> savePicture(@RequestBody PictureReqDto pictureReqDto) {

        gameService.createPicture(pictureReqDto.getUserSeq(), pictureReqDto.getPictureUrl());
        return new ResponseEntity<>("그림 저장 성공", HttpStatus.OK);
    }

    // 원하는 그림 한번에 추가
    @PostMapping(value="/many-picture")
    public ResponseEntity<String> savePictures(@RequestBody PictureReqDto pictureReqDto) {

        gameService.createPictures(pictureReqDto.getUserSeq(), pictureReqDto.getPictureUrlList());
        return new ResponseEntity<>("그림 저장 성공", HttpStatus.OK);
    }


    // test용, 승리, 게임 횟수 초기화
    @PatchMapping(value="/reset")
    public ResponseEntity<String> resetPoint(@RequestBody GameReqDto gameReqDto){

        return new ResponseEntity<>("초기화 성공", HttpStatus.OK);
    }
}
