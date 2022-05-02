package com.ssafy.arcade.game;


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
@RequestMapping("/apiv1/room")
public class GameController {

    private final GameService gameService;

    /**
     *  GameRoom 관련 Controller
     * */
    @PostMapping(value="/create")
    public ResponseEntity<Map<String, String>> createRoom() {

        String inviteCode = gameService.createInviteCode();
        Map<String, String> map = new HashMap<>();
        map.put("inviteCode", inviteCode);

        return new ResponseEntity<>(map, HttpStatus.OK);
    }

    @PatchMapping(value="/enter")
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


}
