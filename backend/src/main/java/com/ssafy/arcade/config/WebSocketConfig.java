package com.ssafy.arcade.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // STOMP를 사용하기 위한 어노테이션
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat").setAllowedOrigins("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
//        여기서 /topic은 1:N의 일대다의 구독방식을 가지고 있고, /queue는 1:1구독방식으로 일대일 메세지 전달을 할때 사용된다.
//        즉 다수에게 메세지를 보낼때는 '/topic/주소', 특정대상에게 메세지를 보낼 때는 '/queue/주소'의 방식을 택하게 된다.
        registry.enableSimpleBroker("/topic","/queue");

//        /app은 메세지를 보내는 prefix로 작동하며 클라이언트->서버로 메세지를 보낼때는 다음과 같은 방식을 통하게 된다.
//        client.send(`/app/chat/보낼주소`,{},JSON.stringify(보낼데이터))
        registry.setApplicationDestinationPrefixes("/app");

    }
}