package com.ssafy.arcade.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.arcade.chat.dtos.ChatMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class RedisChatSubscriber implements MessageListener {


    private final ObjectMapper objectMapper;
    private final RedisTemplate redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try{
            String publishMessage = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());
            // Dto에 매핑한다.
//            System.out.println("매핑전");
            ChatMessageDTO chatMessageDTO = objectMapper.readValue(publishMessage, ChatMessageDTO.class);
//            System.out.println("매핑후 : "+chat);

        }catch(Exception e){
            log.error(e.getMessage());
        }
    }
}