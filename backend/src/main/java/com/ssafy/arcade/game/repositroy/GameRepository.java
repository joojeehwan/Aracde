package com.ssafy.arcade.game.repositroy;

import com.ssafy.arcade.common.util.CommonCode;
import com.ssafy.arcade.game.entity.Game;
import com.ssafy.arcade.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Long> {
    
    // 전체 게임 이력 조회
    Optional<List<Game>> findAllByUser(User user);
    // 게임별 이력 조회
    Optional<List<Game>> findAllByUserAndGameCode(User user, CommonCode gameCode);
}
