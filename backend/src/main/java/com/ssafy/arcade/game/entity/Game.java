package com.ssafy.arcade.game.entity;

import com.ssafy.arcade.common.util.BaseTimeEntity;
import com.ssafy.arcade.common.util.CommonCode;
import com.ssafy.arcade.user.entity.User;
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
public class Game extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameSeq;
    // 승리 횟수
    @Column(nullable = false)
    private Integer vicCnt;
    // 게임 참여 횟수
    @Column(nullable = false)
    private Integer gameCnt;
    // 게임 종류
    @Enumerated(EnumType.STRING)
    private CommonCode gameCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    // 순환참조 방지
    public void setUser(User user) {
        this.user = user;
        // 포함되어있지 않으면
        if (!user.getGameList().contains(this)) {
            user.getGameList().add(this);
        }
    }
}
