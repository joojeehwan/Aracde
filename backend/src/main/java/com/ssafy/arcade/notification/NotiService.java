package com.ssafy.arcade.notification;

import com.ssafy.arcade.common.exception.CustomException;
import com.ssafy.arcade.common.exception.ErrorCode;
import com.ssafy.arcade.notification.dtos.NotiDTO;
import com.ssafy.arcade.notification.entity.Notification;
import com.ssafy.arcade.notification.repository.NotiRepository;
import com.ssafy.arcade.user.UserService;
import com.ssafy.arcade.user.entity.User;
import com.ssafy.arcade.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotiService {
    private final NotiRepository notiRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public List<NotiDTO> getNotification(String token) {
        // 토큰으로 유저 찾기
        User user = userRepository.findByUserSeq(userService.getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        List<Notification> list = notiRepository.findAllByTargetSeq(user.getUserSeq()).orElseThrow(() ->
                new CustomException(ErrorCode.INVALID_DATA));
        List<NotiDTO> notiDTOList = new ArrayList<>();
        for (Notification notification : list) {
            // NotiDto로 바꿔서 넣어
            notiDTOList.add(NotiDTO.builder()
                    .notiSeq(notification.getNotiSeq()).userSeq(notification.getUserSeq())
                    .name(notification.getName()).type(notification.getType()).inviteCode(notification.getInviteCode())
                    .isConfirm(notification.isConfirm()).time(notification.getTime()).build());
        }
        return notiDTOList;
    }

    // 알림 읽음 처리
    public String readNotification(String token, Long notiSeq) {
        // 토큰으로 유저 찾기
        User user = userRepository.findByUserSeq(userService.getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        Notification notification = notiRepository.findByNotiSeq(notiSeq).orElseGet(Notification::new);
        // 읽음 처리 후 저장
//        if (notification.getNotiSeq() != null) {
            notification.setConfirm(true);
            notiRepository.save(notification);
//        }
        return "OK";
    }

    public String deleteNotification(String token, Long notiSeq) {
        // 토큰으로 유저 찾기
        User user = userRepository.findByUserSeq(userService.getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        Notification notification = notiRepository.findByNotiSeq(notiSeq).orElseGet(Notification::new);
//        if (notification.getNotiSeq() != null)
            notiRepository.delete(notification);
        return "OK";
    }
}
