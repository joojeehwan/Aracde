package com.ssafy.arcade.user.repository;

import com.ssafy.arcade.user.entity.Friend;
import com.ssafy.arcade.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    Optional<Friend> findByRequestAndTarget(User request, User target);
}
