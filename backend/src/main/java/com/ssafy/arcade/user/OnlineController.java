package com.ssafy.arcade.user;

import com.ssafy.arcade.common.exception.CustomException;
import com.ssafy.arcade.common.exception.ErrorCode;
import com.ssafy.arcade.user.entity.User;
import com.ssafy.arcade.user.repository.UserRepository;
import com.ssafy.arcade.user.response.ProfileResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/apiv1/online")
public class OnlineController {
    private final OnlineService onlineService;

    // 온라인
    @PostMapping(value = "/enter")
    public ResponseEntity<String> online(@RequestHeader("Authorization") String token) {
        return new ResponseEntity<>(onlineService.online(token), HttpStatus.OK);
    }
    // 오프라인
    @PostMapping(value = "/out")
    public ResponseEntity<String> out(@RequestHeader("Authorization") String token) {
        return new ResponseEntity<>(onlineService.out(token), HttpStatus.OK);
    }
}
