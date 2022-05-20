package com.ssafy.arcade.game.entity;

import com.ssafy.arcade.common.util.BaseTimeEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GameRoom extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameRoomSeq;
    // 초대코드
    @Column(nullable = false)
    private String inviteCode;
    // 현재 인원
    @Column(nullable = false)
    private Integer currentMember;
    // 삭제 여부
//    @Column
//    private boolean isDel;
//
//    public void deleteRoom() {
//        this.isDel = true;
//    }

    public void addMember() {
        this.currentMember++;
    }
    public void delMember() { this.currentMember--; }
}
