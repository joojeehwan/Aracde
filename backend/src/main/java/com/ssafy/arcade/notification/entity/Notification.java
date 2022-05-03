package com.ssafy.arcade.notification.entity;

import com.ssafy.arcade.common.util.BaseTimeEntity;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@RedisHash("Notification")// 레디스 db에 매핑하겠다.
public class Notification extends BaseTimeEntity {
    @Id
    private Long notiSeq;
    private Long userSeq; // 누가 보낸 알람인지
    private String name;
    private String inviteCode;
    private String type;
}
