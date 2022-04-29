package com.ssafy.arcade.notification;

import com.ssafy.arcade.notification.dtos.NotiDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin("*")
@RequiredArgsConstructor
public class notiController {
    private final SimpMessagingTemplate template; //특정 Broker로 메세지를 전달

    // A -> B 알람 보낼때
    @MessageMapping("/noti/{userSeq}")
    public void message(@DestinationVariable("userSeq") Long userSeq, NotiDTO notiDTO) {
        template.convertAndSend("/sub/noti/" + userSeq, notiDTO);
    }


}
