//`package com.ssafy.arcade.notification;
//
//import com.ssafy.arcade.common.RedisPublisher;
//import lombok.RequiredArgsConstructor;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.CrossOrigin;
//
//@Controller
//@CrossOrigin("*")
//@RequiredArgsConstructor
//public class NotiController {
//    private final SimpMessagingTemplate template; //특정 Broker로 메세지를 전달
//    private final RedisPublisher redisPublisher;

//    // A -> B 알람 보낼때
//    @MessageMapping("/noti/{userSeq}")
//    public void message(@DestinationVariable("userSeq") Long userSeq, NotiDTO notiDTO) {
//        System.out.println("noti controller");
//        ChannelTopic topic = new ChannelTopic(String.valueOf(userSeq)); // destination
//        redisPublisher.publish(topic, notiDTO); // destination, data
//    }


//}
