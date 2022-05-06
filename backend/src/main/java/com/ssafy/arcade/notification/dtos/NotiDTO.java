package com.ssafy.arcade.notification.dtos;

import com.ssafy.arcade.notification.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotiDTO {
    private Long notiSeq;
    private Long userSeq; // 누가 보낸 알람인지
    private String name;
    private String type;
    private String inviteCode;
    private boolean isConfirm; // 읽었는지 안읽었는지 여부
    private String time;
}
