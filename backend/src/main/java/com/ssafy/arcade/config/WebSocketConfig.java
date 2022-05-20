package com.ssafy.arcade.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // STOMP를 사용하기 위한 어노테이션
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // /arcade : WebSocket 또는 SockJS Client가 웹소켓 핸드셰이크 커넥션을 생성할 경로이다.
        registry.addEndpoint("/ws-stomp").setAllowedOriginPatterns("*").withSockJS();
        registry.addEndpoint("/ws-stomp").setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
//        여기서 /topic은 1:N의 일대다의 구독방식을 가지고 있고, /queue는 1:1구독방식으로 일대일 메세지 전달을 할때 사용된다.
//        즉 다수에게 메세지를 보낼때는 '/topic/주소', 특정대상에게 메세지를 보낼 때는 '/queue/주소'의 방식을 택하게 된다.
        // 내장된 메세지 브로커를 사용해 Client에게 Subscriptions, Broadcasting 기능을 제공한다.
        // 또한 /topic, /queue로 시작하는 "destination" 헤더를 가진 메세지를 브로커로 라우팅한다.
//        registry.enableSimpleBroker("/topic","/queue");

//        /pub은 메세지를 보내는 prefix로 작동하며 클라이언트->서버로 메세지를 보낼때는 다음과 같은 방식을 통하게 된다.
//        client.send(`/app/chat/보낼주소`,{},JSON.stringify(보낼데이터))
        // /pub 경로로 시작하는 STOMP 메세지의 "destination" 헤더는 @Controller 객체의 @MessageMapping 메서드로 라우팅된다.
        registry.setApplicationDestinationPrefixes("/pub");
        // 해당 경로로 SimpleBroker를 등록. SimpleBroker는 해당하는 경로를 SUBSCRIBE하는 Client에게 메세지를 전달하는 간단한 작업을 수행
        registry.enableSimpleBroker("/sub");

    }
}