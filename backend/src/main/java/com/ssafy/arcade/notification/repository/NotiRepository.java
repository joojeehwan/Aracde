package com.ssafy.arcade.notification.repository;

import com.ssafy.arcade.notification.entity.Notification;
import org.springframework.data.repository.CrudRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface NotiRepository extends CrudRepository<Notification, Long> {
    Optional<List<Notification>> findAllByTypeAndUserSeqAndTargetSeq(String type, Long userSeq, Long targetSeq);
    Optional<List<Notification>> findAllByTargetSeq(Long targetSeq);
    Optional<Notification> findByNotiSeq(Long notiSeq);
}
