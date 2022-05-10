package com.ssafy.arcade.messege.entity;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.ssafy.arcade.common.util.BaseTimeEntity;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@RedisHash("message")// 레디스 db에 매핑하겠다.
public class Message extends BaseTimeEntity {
    @Id
    private Long messageSeq;
    @Indexed
    private Long chatRoomSeq;
    @Indexed
    private Long sender;
    private String content;
    private String profile;
    private String name;
    private String time;

    @Builder
    public Message(Long chatRoomSeq, Long sender, String content, String profile, String name,String time) {
        this.chatRoomSeq = chatRoomSeq;
        this.sender = sender;
        this.content = content;
        this.profile = profile;
        this.name = name;
        this.time=time;
    }
}