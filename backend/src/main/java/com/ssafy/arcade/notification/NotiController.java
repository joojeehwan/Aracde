package com.ssafy.arcade.notification;

import com.ssafy.arcade.common.RedisPublisher;
import com.ssafy.arcade.notification.dtos.NotiDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin("*")
@RequiredArgsConstructor
@RequestMapping("/apiv1/noti")
public class NotiController {
    private final NotiService notiService;
    // 알림 가져오기
    @GetMapping
    public ResponseEntity<List<NotiDTO>> getNotification(@RequestHeader("Authorization") String token) {
        return new ResponseEntity<>(notiService.getNotification(token), HttpStatus.OK);
    }
    // 알림 읽음 처리
    @PostMapping
    public ResponseEntity<String> readNotification(@RequestHeader("Authorization") String token, @RequestParam Long notiSeq) {
        return new ResponseEntity<>(notiService.readNotification(token,notiSeq), HttpStatus.OK);
    }
    // 알림 삭제
    @DeleteMapping
    public ResponseEntity<String> deleteNotification(@RequestHeader("Authorization") String token, @RequestParam Long notiSeq) {
        return new ResponseEntity<>(notiService.deleteNotification(token,notiSeq), HttpStatus.OK);
    }
}
