package com.ssafy.arcade.messege.repository;

import com.ssafy.arcade.messege.entity.Message;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends CrudRepository<Message, Long> {
//    Optional<List<Message>> findAllByChatRoomSeq(Long chatRoomSeq);
    Optional<List<Message>> findTop20ByChatRoomSeqOrderByRealTime(Long chatRoomSeq);
    Optional<List<Message>> findAllByChatRoomSeqOrderByRealTime(Long chatRoomSeq);
    List<Message> findAllByChatRoomSeq(Long chatRoomSeq);
    void deleteAllByChatRoomSeq(Long chatRoomSeq);
    void deleteByChatRoomSeq(Long chatRoomSeq);
//    Iterable<List<Message>> findAllByChatRoomSeq(Long chatRoomSeq);
}
