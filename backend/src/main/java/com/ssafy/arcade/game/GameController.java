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

    @DeleteMapping(value="/delete")
    public ResponseEntity<String> deleteRoom(@RequestBody RoomReqDto roomReqDto) {

        gameService.deleteGameRoom(roomReqDto.getInviteCode());
        return new ResponseEntity<>("방 삭제 성공", HttpStatus.OK);
    }

}