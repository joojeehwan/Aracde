package com.ssafy.arcade.game.repositroy;

import com.ssafy.arcade.common.util.Code;
import com.ssafy.arcade.game.entity.GameUser;
import com.ssafy.arcade.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GameUserRepository extends JpaRepository<GameUser, Long> {

    // 게임 종류 구분
    Optional<GameUser> findByUserAndGameCode(User user, Code gameCode);
    // 모든 게임
    Optional<List<GameUser>> findAllByUser(User user);

}
