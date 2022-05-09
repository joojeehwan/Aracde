package com.ssafy.arcade.game.entity;


import com.ssafy.arcade.common.util.BaseTimeEntity;
import com.ssafy.arcade.common.util.Code;
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
public class GameUser extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameUserSeq;

    // 게임 종류
    @Enumerated(EnumType.STRING)
    private Code gameCode;

    @ManyToOne
    @JoinColumn(name="game_seq")
    private Game game;

    @ManyToOne
    @JoinColumn(name="user_seq")
    private User user;


    public void setGame(Game game) {
        this.game = game;
        if (!game.getGameUsers().contains(this)) {
            game.getGameUsers().add(this);
        }
    }

    public void setUser(User user) {
        this.user = user;
        if (!user.getGameUsers().contains(this)) {
            user.getGameUsers().add(this);
        }
    }
}
