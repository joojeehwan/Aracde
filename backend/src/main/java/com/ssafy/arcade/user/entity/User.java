package com.ssafy.arcade.user.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ssafy.arcade.chat.entity.ChatRoom;
import com.ssafy.arcade.common.util.BaseTimeEntity;
import com.ssafy.arcade.game.entity.Game;
import com.ssafy.arcade.game.entity.GameUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userSeq;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String image;

    // 친구를 맺은 순간, 친구 신청건 쪽 - 친구요청 받은쪽이 Friend에 저장.
    // 나중에 조회할 때는 friendList || targetList 가 내 전체 친구리스트가 되는것!
    @OneToMany(mappedBy = "request", orphanRemoval = true)
    private List<Friend> requestList = new ArrayList<>();

    @OneToMany(mappedBy = "target", orphanRemoval = true)
    private List<Friend> targetList = new ArrayList<>();

    // 게임 table
    @OneToMany(mappedBy = "user")
    private List<GameUser> gameUsers = new ArrayList<>();

    // chatRoom1과 2를 합쳐 나의 전체 채팅방 목록이 된다.
    @OneToMany(mappedBy = "user1", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ChatRoom> chatRooms1 = new ArrayList<>();
    @OneToMany(mappedBy = "user2", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ChatRoom> chatRooms2 = new ArrayList<>();


    public void addFriend(Friend friend) {
        this.requestList.add(friend);
        if (friend.getRequest() != this) {
            friend.setRequest(this);
        }
    }

    public void addTarget(Friend friend) {
        this.targetList.add(friend);
        if (friend.getTarget() != this) {
            friend.setTarget(this);
        }
    }

    public void addGameUsers(GameUser gameUser) {
        this.gameUsers.add(gameUser);
        if (gameUser.getUser() != this) {
            gameUser.setUser(this);
        }
    }



//    @JsonManagedReference // 순환 참조 방어
//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//    private List<Feed> feeds = new ArrayList<>();

}
