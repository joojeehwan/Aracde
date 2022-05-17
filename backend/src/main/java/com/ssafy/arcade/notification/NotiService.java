package com.ssafy.arcade.notification;

import com.ssafy.arcade.common.exception.CustomException;
import com.ssafy.arcade.common.exception.ErrorCode;
import com.ssafy.arcade.game.request.InviteReq;
import com.ssafy.arcade.notification.dtos.NotiDTO;
import com.ssafy.arcade.notification.entity.Notification;
import com.ssafy.arcade.notification.repository.NotiRepository;
import com.ssafy.arcade.user.UserService;
import com.ssafy.arcade.user.entity.User;
import com.ssafy.arcade.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotiService {
    private final NotiRepository notiRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final SimpMessageSendingOperations messageTemplate;


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
    public String readNotification(String token) {
        // 토큰으로 유저 찾기
        User user = userRepository.findByUserSeq(userService.getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        List<Notification> notifications = notiRepository.findAllByTargetSeq(user.getUserSeq()).orElseThrow(()->
                new CustomException(ErrorCode.DATA_NOT_FOUND));
        // 읽음 처리 후 저장
//        if (notification.getNotiSeq() != null) {
        for (Notification notification : notifications){
            notification.setConfirm(true);
            notiRepository.save(notification);
        }
//        }
        return "OK";
    }

    public String deleteNotification(String token, String notiSeq) {
        // 토큰으로 유저 찾기
        User user = userRepository.findByUserSeq(userService.getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        Notification notification = notiRepository.findByNotiSeq(notiSeq).orElseGet(Notification::new);
        if (notification.getNotiSeq() != null)
            notiRepository.delete(notification);
        return "OK";
    }

    public String sendFriendNotification(String token, Long userSeq) {
        // 토큰으로 유저 찾기
        User user = userRepository.findByUserSeq(userService.getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));

        User targetUser = userRepository.findByUserSeq(userSeq).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));

        // 알림 생성
        notiRepository.save(Notification.builder()
                .userSeq(user.getUserSeq()).type("Friend").targetSeq(targetUser.getUserSeq())
                .time(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(LocalDateTime.now()))
                .name(user.getName()).isConfirm(false).build());

        // 두개 이상일수도 있음; 친구 요청을 두번 이상 보낼수도 있으니까
        List<Notification> notifications = notiRepository.findAllByTypeAndUserSeqAndTargetSeq("Friend", user.getUserSeq(), targetUser.getUserSeq())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_DATA));
        // 리스트를 time 내림차순정렬
        notifications.sort((o1, o2) -> -o1.getTime().compareTo(o2.getTime()));
        // 가장 최근 noti 가져옴.
        Notification notification = notifications.get(0);
        // publish
        messageTemplate.convertAndSend("/sub/" + targetUser.getUserSeq(), NotiDTO.builder()
                .time(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(LocalDateTime.now()))
                .notiSeq(notification.getNotiSeq()).type("Friend").userSeq(user.getUserSeq()).name(user.getName())
                .isConfirm(false).build());
        return "OK";
    }

    public String sendGameNotification(InviteReq inviteReq) {
        User user = userRepository.findByUserSeq(inviteReq.getUserSeq()).orElseThrow(()->
                new CustomException(ErrorCode.USER_NOT_FOUND));
        User targetUser = userRepository.findByUserSeq(inviteReq.getTargetSeq()).orElseThrow(()->
                new CustomException(ErrorCode.USER_NOT_FOUND));
        // 알림 저장
        notiRepository.save(Notification.builder()
                .userSeq(user.getUserSeq()).type("Game").targetSeq(targetUser.getUserSeq())
                .time(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(LocalDateTime.now()))
                .inviteCode(inviteReq.getInviteCode())
                .name(user.getName()).isConfirm(false).build());

        // 알림 보내기
        // 두개 이상일수도 있음; 게임 요청을 두번 이상 보낼수도 있으니까
        List<Notification> notifications = notiRepository.findAllByTypeAndUserSeqAndTargetSeq("Game", user.getUserSeq(), targetUser.getUserSeq())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_DATA));
        // 리스트를 time 내림차순정렬
        notifications.sort((o1, o2) -> -o1.getTime().compareTo(o2.getTime()));
        // 가장 최근 noti 가져옴.
        Notification notification = notifications.get(0);
        // pub
        messageTemplate.convertAndSend("/sub/" + targetUser.getUserSeq(), NotiDTO.builder()
                .time(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(LocalDateTime.now()))
                .notiSeq(notification.getNotiSeq()).type("Game").userSeq(user.getUserSeq()).name(user.getName())
                .isConfirm(false).build());
        return "OK";
    }
}
