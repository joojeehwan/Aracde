package com.ssafy.arcade.game.repositroy;

import com.ssafy.arcade.game.entity.GameRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRoomRepository extends JpaRepository<GameRoom, Long> {
    Optional<GameRoom> findByInviteCode(String inviteCode);
}
