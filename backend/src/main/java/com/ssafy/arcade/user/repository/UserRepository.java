package com.ssafy.arcade.user.repository;

import com.ssafy.arcade.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {

}
