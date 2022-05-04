package com.ssafy.arcade.notification.repository;

import com.ssafy.arcade.notification.entity.Notification;
import org.springframework.data.repository.CrudRepository;

public interface NotiRepository extends CrudRepository<Notification, String> {
}
