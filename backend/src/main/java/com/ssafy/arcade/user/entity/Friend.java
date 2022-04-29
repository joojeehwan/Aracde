package com.ssafy.arcade.user.entity;

import com.ssafy.arcade.common.util.BaseTimeEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Friend extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long friendSeq;

    // 친구 수락여부, 신청단계에서는 False, 상대가 수락해야 True
    @Column(nullable = false)
    private boolean isApproved;

    @ManyToOne
    @JoinColumn(name="REQUEST_SEQ")
    private User request;

    @ManyToOne
    @JoinColumn(name="TARGET_SEQ")
    private User target;

    public void setRequest(User user) {
        this.request = user;
        if(!user.getRequestList().contains(this)) {
            user.getRequestList().add(this);
        }
    }

    public void setTarget(User user) {
        this.target = user;

        if(!user.getTargetList().contains(this)) {
            user.getTargetList().add(this);
        }
    }

    public void setApproved(boolean isApproved) {
        this.isApproved = isApproved;
    }

}
