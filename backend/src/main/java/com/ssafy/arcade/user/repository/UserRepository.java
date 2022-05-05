package com.ssafy.arcade.user.repository;

import com.ssafy.arcade.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUserSeq(Long userSeq);
    Optional<User> findByName(String name);
    Optional<List<User>> findByNameContains(String name);
}
