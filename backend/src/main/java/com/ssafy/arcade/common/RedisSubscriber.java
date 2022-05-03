package com.ssafy.arcade.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.arcade.chat.dtos.response.SendMessageRes;
import com.ssafy.arcade.notification.dtos.NotiDTO;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class RedisSubscriber implements MessageListener {


    private final ObjectMapper objectMapper;
    private final RedisTemplate redisTemplate;
    private final RedisMessageListenerContainer redisMessageListenerContainer;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try{
            String body = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());
            // Dto에 매핑한다.
            SendMessageRes sendMessageRes = objectMapper.readValue(body, SendMessageRes.class);
            log.info("[메시지 내용] : {}", sendMessageRes.getContent());

        }catch(Exception e){
            log.error(e.getMessage());
        }
    }
}