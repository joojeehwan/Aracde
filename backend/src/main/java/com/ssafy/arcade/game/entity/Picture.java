package com.ssafy.arcade.game.entity;

import com.ssafy.arcade.common.util.BaseTimeEntity;
import com.ssafy.arcade.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Picture extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pictureSeq;

    @Column(nullable = false)
    private String pictureUrl;
    @Column(nullable = false)
    private boolean delYn;
    @CreatedDate
    private LocalDateTime createdDate;

    @ManyToOne
    @JoinColumn(name="user_seq")
    private User user;

    public void setUser(User user) {
        this.user = user;
        if (!user.getPictureList().contains(this)) {
            user.getPictureList().add(this);
        }
    }
    public void deletePicture() {
        this.delYn = true;
    }

}
