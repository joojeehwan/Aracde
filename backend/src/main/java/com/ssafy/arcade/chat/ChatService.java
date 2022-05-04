package com.ssafy.arcade.chat;

import com.ssafy.arcade.chat.dtos.request.CreateChattingRoomReq;
import com.ssafy.arcade.chat.dtos.request.SendMessageReq;
import com.ssafy.arcade.chat.dtos.response.SendMessageRes;
import com.ssafy.arcade.chat.entity.ChatRoom;
import com.ssafy.arcade.chat.repository.ChatRoomRepository;
import com.ssafy.arcade.common.RedisPublisher;
import com.ssafy.arcade.common.RedisSubscriber;
import com.ssafy.arcade.common.exception.CustomException;
import com.ssafy.arcade.common.exception.ErrorCode;
import com.ssafy.arcade.messege.entity.Message;
import com.ssafy.arcade.user.UserService;
import com.ssafy.arcade.user.entity.User;
import com.ssafy.arcade.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final ChatRoomRepository chatRoomRepository;
    private final RedisMessageListenerContainer redisMessageListener;
    private final RedisPublisher redisPublisher;
    private final RedisSubscriber redisSubscriber;
    private Map<String, ChannelTopic> channels;

    @PostConstruct
    public void init() {
        channels = new HashMap<>();
    }

    public String createChattingRoom(String token, CreateChattingRoomReq createChattingRoomReq) {

        // 토큰으로 유저 찾기
        User user = userRepository.findByUserSeq(userService.getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        // 상대방 찾기
        User target = userRepository.findByUserSeq(createChattingRoomReq.getTargetUserSeq()).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        // 이미 채팅방이 존재하는 경우 에러
        List<ChatRoom> chatRooms = chatRoomRepository.findAll();

        ChatRoom chatRoom = null;
        for (ChatRoom chat : chatRooms) {
            if ((chat.getUser1().getUserSeq() == user.getUserSeq() && chat.getUser2().getUserSeq() == target.getUserSeq())
                    || (chat.getUser2().getUserSeq() == user.getUserSeq() && chat.getUser1().getUserSeq() == target.getUserSeq())) {
                chatRoom = chat;
            }
        }
        if (chatRoom != null) {
            throw new CustomException(ErrorCode.DUPLICATE_RESOURCE);
        }
        chatRoom = ChatRoom.builder()
                .user1(user).user2(target).build();
        // 채팅방 만들기
        chatRoomRepository.save(chatRoom);
        // 해당 채팅방 토픽 생성
        ChannelTopic channel = new ChannelTopic("/chat/room/" + chatRoom.getChatRoomSeq());
        // 리스너 등록
        redisMessageListener.addMessageListener(redisSubscriber, channel);

        channels.put("room" + chatRoom.getChatRoomSeq(), channel);

        return "OK";
    }

    public String sendMessage(String token, SendMessageReq sendMessageReq) {
        // 토큰으로 유저 찾기
        User user = userRepository.findByUserSeq(userService.getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        Message message = sendMessageReq.toEntity(user.getImage(), user.getName(), user.getUserSeq());
        // 채팅 로직 처리
        // 1. 한 사람이 메시지를 보낸다.
        // 2. 다른사람이 채팅방을 구독(접속) 중인 경우
        //  2-1. message 테이블에 데이터 저장 후 broker를 통해 구독자들에게 전부 뿌린다.
        //  2-2. 채팅방의 lastMessage, time 등을 조정한다.
        // 3. 다른 사람이 채팅방에 존재하지 않는 경우
        //  3-1.
        ChannelTopic channel = channels.get("room"+sendMessageReq.getChatRoomSeq());
        SendMessageRes sendMessageRes = SendMessageRes.builder()
                .name(user.getName()).image(user.getImage())
                .content(sendMessageReq.getContent()).chatRoomSeq(sendMessageReq.getChatRoomSeq()).build();
        redisPublisher.publish(channel, sendMessageRes);
        return "OK";
    }

    public SendMessageRes testSendMessage(SendMessageReq sendMessageReq) {
        ChannelTopic channel = channels.get("room"+sendMessageReq.getChatRoomSeq());
        SendMessageRes sendMessageRes = SendMessageRes.builder()
                .name("박현우").content("뭘봐").image("hh").build();
        redisPublisher.publish(channel, sendMessageRes);
        return sendMessageRes;
    }

    public ChatRoom testCreateChattingRoom(CreateChattingRoomReq createChattingRoomReq) {
        ChatRoom chatRoom = ChatRoom.builder()
                .build();
        // 채팅방 만들기
        chatRoomRepository.save(chatRoom);
        // 해당 채팅방 토픽 생성
        ChannelTopic channel = new ChannelTopic("room" + chatRoom.getChatRoomSeq());
        // 리스너 등록
        redisMessageListener.addMessageListener(redisSubscriber, channel);

        channels.put("room" + chatRoom.getChatRoomSeq(), channel);
        System.out.println("채널 이름 : room"+chatRoom.getChatRoomSeq());
        return chatRoom;
    }

    public String testEnter(Long chatRoomSeq) {
        // 해당 채팅방 토픽 생성
        ChannelTopic channel = new ChannelTopic("room" + chatRoomSeq);
        // 리스너 등록
        redisMessageListener.addMessageListener(redisSubscriber, channel);
        return "";
    }
}
