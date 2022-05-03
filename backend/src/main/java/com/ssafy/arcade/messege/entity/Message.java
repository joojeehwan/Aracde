package com.ssafy.arcade.messege.entity;

import com.ssafy.arcade.common.util.BaseTimeEntity;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Setter
@NoArgsConstructor
@RedisHash("message")// 레디스 db에 매핑하겠다.
public class Message extends BaseTimeEntity {
    @Id
    private Long messageSeq;
    private Long chatRoomSeq;
    private Long sender;
    private String content;
    private String profile;
    private String name;

    @Builder
    public Message(Long chatRoomSeq, Long sender, String content, String profile, String name) {
        this.chatRoomSeq = chatRoomSeq;
        this.sender = sender;
        this.content = content;
        this.profile = profile;
        this.name = name;
    }
}