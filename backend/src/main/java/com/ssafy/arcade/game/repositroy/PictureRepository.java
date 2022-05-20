package com.ssafy.arcade.game.repositroy;

import com.ssafy.arcade.game.entity.Picture;
import com.ssafy.arcade.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PictureRepository extends JpaRepository<Picture, Long> {

    Optional<Picture> findByUserAndPictureUrlAndDelYn(User user, String pictureUrl, boolean delYn);
    Optional<List<Picture>> findAllByUserAndDelYn(User user, boolean delYn);
}
