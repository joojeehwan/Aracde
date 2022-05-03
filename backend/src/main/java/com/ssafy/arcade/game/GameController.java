package com.ssafy.arcade.game;


import com.ssafy.arcade.game.request.GameReqDto;
import com.ssafy.arcade.game.request.PictureReqDto;
import com.ssafy.arcade.game.request.RoomReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

        if (gameService.exitGameRoom(roomReqDto.getInviteCode())){
            return new ResponseEntity<>("방 닫힘", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("요청 성공", HttpStatus.OK);
        }
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
    // 이어그리기 그림 추가
    @PostMapping(value="/picture")
    public ResponseEntity<String> savePicture(@RequestBody PictureReqDto pictureReqDto) {

        gameService.createPicture(pictureReqDto.getUserSeq(), pictureReqDto.getPictureUrls());
        return new ResponseEntity<>("그림 저장 성공", HttpStatus.OK);
    }


    // test용, 승리, 게임 횟수 초기화
    @PatchMapping(value="/reset")
    public ResponseEntity<String> resetPoint(@RequestBody GameReqDto gameReqDto){

        return new ResponseEntity<>("초기화 성공", HttpStatus.OK);
    }
}
