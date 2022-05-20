package com.ssafy.arcade.messege.entity;

import com.ssafy.arcade.common.util.BaseTimeEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Setter
@NoArgsConstructor
@RedisHash("unreadMessage")// 레디스 db에 매핑하겠다.
public class UnreadMessage {
    @Id
    private Long unreadMessageSeq;
    private Long chatRoomSeq;
    private Long sender;
    private String content;

    @Builder
    public UnreadMessage(Long chatRoomSeq, Long sender, String content) {
        this.chatRoomSeq = chatRoomSeq;
        this.sender = sender;
        this.content = content;
    }
}