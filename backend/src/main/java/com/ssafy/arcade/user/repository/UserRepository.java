package com.ssafy.arcade.user.repository;

import com.ssafy.arcade.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
    Optional<User> findByUserSeq(Long userSeq);
    Optional<List<User>> findByNameContains(String name);
    // 이메일로 찾기, 소셜로그인 부분에서 필요
    Optional<User> findByEmailAndProvider(String email, String provider);
}
