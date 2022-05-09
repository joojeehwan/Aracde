package com.ssafy.arcade.notification.entity;

import com.ssafy.arcade.common.util.BaseTimeEntity;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import java.io.Serializable;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@RedisHash("notification")// 레디스 db에 매핑하겠다.
public class Notification extends BaseTimeEntity {
    @Id
    @Indexed
    private String notiSeq;
    @Indexed
    private Long userSeq; // 누가 보낸 알람인지
    @Indexed
    private Long targetSeq;
    private String name;
    private String inviteCode;
    @Indexed
    private String type;
    private boolean isConfirm;
    @Indexed
    private String time;
}
