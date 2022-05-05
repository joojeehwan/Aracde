package com.ssafy.arcade.game.entity;

import com.ssafy.arcade.common.util.BaseTimeEntity;
import com.ssafy.arcade.common.util.Code;
import com.ssafy.arcade.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    
    @OneToMany(mappedBy = "game")
    private List<GameUser> gameUsers = new ArrayList<>();


    public void addGameUsers(GameUser gameUser) {
        this.gameUsers.add(gameUser);
        if (gameUser.getGame() != this) {
            gameUser.setGame(this);
        }
    }

    public void addVicCnt() {
        this.vicCnt++;
    }
    public void addGameCnt() { this.gameCnt++; }
}
