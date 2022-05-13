package com.ssafy.arcade.notification.repository;

import org.springframework.data.repository.CrudRepository;
import com.ssafy.arcade.notification.entity.Notification;
import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface NotiRepository extends CrudRepository<Notification, String> {
    Optional<List<Notification>> findAllByTypeAndUserSeqAndTargetSeq(String type, Long userSeq, Long targetSeq);
    Optional<List<Notification>> findAllByTargetSeq(Long targetSeq);
    Optional<Notification> findByNotiSeq(String notiSeq);
    Optional<Notification> deleteByNotiSeq(String notiSeq);
}
