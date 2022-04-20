package com.ssafy.arcade.user.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ssafy.arcade.common.util.BaseTimeEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;

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


//    @JsonManagedReference // 순환 참조 방어
//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//    private List<Feed> feeds = new ArrayList<>();


}
