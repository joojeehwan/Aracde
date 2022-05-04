package com.ssafy.arcade.game.repositroy;

import com.ssafy.arcade.game.entity.Game;
import com.ssafy.arcade.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Long> {

}
