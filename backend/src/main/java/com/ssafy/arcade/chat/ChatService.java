package com.ssafy.arcade.chat;

import com.ssafy.arcade.chat.dtos.request.CreateChattingRoomReq;
import com.ssafy.arcade.chat.dtos.request.SendMessageReq;
import com.ssafy.arcade.chat.dtos.response.ChatRoomListDTO;
import com.ssafy.arcade.chat.dtos.response.SearchFriendRes;
import com.ssafy.arcade.chat.dtos.response.SendMessageRes;
import com.ssafy.arcade.chat.entity.ChatRoom;
import com.ssafy.arcade.chat.repository.ChatRoomRepository;
import com.ssafy.arcade.common.RedisPublisher;
import com.ssafy.arcade.common.RedisSubscriber;
import com.ssafy.arcade.common.exception.CustomException;
import com.ssafy.arcade.common.exception.ErrorCode;
import com.ssafy.arcade.messege.entity.Message;
import com.ssafy.arcade.messege.repository.MessageRepository;
import com.ssafy.arcade.user.OnlineService;
import com.ssafy.arcade.user.UserService;
import com.ssafy.arcade.user.entity.User;
import com.ssafy.arcade.user.repository.UserRepository;
import com.ssafy.arcade.user.response.UserResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    private final MessageRepository messageRepository;
    private final OnlineService onlineService;

    private Map<String, ChannelTopic> channels;

    @PostConstruct
    public void init() {
        channels = new HashMap<>();
    }

    // 해당 채팅방에 접속했을때
    public ChannelTopic enterRoomDetail(Long chatRoomSeq) {
        ChannelTopic topic = channels.get("/sub/chat/room/detail/" + chatRoomSeq);
        // 토픽이 없으면 만든다.
        if (topic == null) {
            topic = new ChannelTopic("/sub/chat/room/detail/" + chatRoomSeq);
            redisMessageListener.addMessageListener(redisSubscriber, topic);
            channels.put("/sub/chat/room/detail/" + chatRoomSeq, topic);
        }


        return topic;
    }

    public ChannelTopic enterRoom(Long chatRoomSeq) {
        ChannelTopic topic = channels.get("/sub/chat/room/" + chatRoomSeq);
        // 토픽이 없으면 만든다.
        if (topic == null) {
            topic = new ChannelTopic("/sub/chat/room/" + chatRoomSeq);
            redisMessageListener.addMessageListener(redisSubscriber, topic);
            channels.put("/sub/chat/room/" + chatRoomSeq, topic);
        }



        return topic;
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
        // topic을 만든다. 이미 존재하면 그냥 그 토픽으로 들어감.
        ChannelTopic channel = enterRoomDetail(sendMessageReq.getChatRoomSeq());
        SendMessageRes sendMessageRes = SendMessageRes.builder().userSeq(user.getUserSeq()).realTime(String.valueOf(LocalDateTime.now()))
                .name(user.getName()).image(user.getImage()).time(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(LocalDateTime.now()))
                .content(sendMessageReq.getContent()).chatRoomSeq(sendMessageReq.getChatRoomSeq()).type(SendMessageRes.Type.CHAT).build();
        redisPublisher.publish(channel, sendMessageRes);
        // redis에 저장하기
        messageRepository.save(message);
        // 채팅방 최근 메시지랑 최근 시간 변경하기
        ChatRoom chatRoom = chatRoomRepository.findByChatRoomSeq(sendMessageReq.getChatRoomSeq()).orElseThrow(()->
                new CustomException(ErrorCode.DATA_NOT_FOUND));
        chatRoom.setLastContent(sendMessageReq.getContent());
        chatRoom.setLastTime(message.getTime());
        chatRoomRepository.save(chatRoom);
        // 현재 구독중인 왼쪽 채팅방 리스트에도 뿌려준다.
        ChannelTopic topic = getTopic(chatRoom.getChatRoomSeq());
        // pub url을 바꾸기 위해 타입을 바꿔준다.
        SendMessageRes res = SendMessageRes.builder().realTime(String.valueOf(LocalDateTime.now()))
                .chatRoomSeq(chatRoom.getChatRoomSeq()).type(SendMessageRes.Type.CHATROOM)
                .content(chatRoom.getLastContent()).time(chatRoom.getLastContent()).build();
        redisPublisher.publish(topic, res);
        return "OK";
    }

    public ChannelTopic getTopic(Long chatRoomSeq) {
        return channels.get("/sub/chat/room/" + chatRoomSeq);
    }

    public List<ChatRoomListDTO> getChattingRoom(String token) {
        // 토큰으로 유저 찾기
        User user = userRepository.findByUserSeq(userService.getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        List<ChatRoomListDTO> list = new ArrayList<>();
        List<ChatRoom> chatRooms = chatRoomRepository.findAll();
        for (ChatRoom chatRoom : chatRooms) {
            if (chatRoom.getUser1().getUserSeq() == user.getUserSeq()) {
                // 상대방 이름, 상대방 이미지, 채팅방 마지막 메시지, 마지막 시간
                User target = chatRoom.getUser2();
                ChannelTopic topic = onlineService.getOnlineTopic(target.getUserSeq());
                boolean flag = topic != null;
                list.add(ChatRoomListDTO.builder()
                                .login(flag)
                        .chatRoomSeq(chatRoom.getChatRoomSeq())
                        .image(target.getImage()).name(target.getName())
                        .lastMessage(chatRoom.getLastContent())
                        .lastTime(chatRoom.getLastTime()).build());
            } else if (chatRoom.getUser2().getUserSeq() == user.getUserSeq()) {
                User target = chatRoom.getUser1();
                ChannelTopic topic = channels.get("/sub/" + target.getUserSeq());
                boolean flag = topic != null;
                list.add(ChatRoomListDTO.builder().login(flag)
                        .chatRoomSeq(chatRoom.getChatRoomSeq())
                        .image(target.getImage()).name(target.getName())
                        .lastMessage(chatRoom.getLastContent())
                        .lastTime(chatRoom.getLastTime()).build());
            }
        }
        // topic 발행
        for (ChatRoomListDTO chatRoomListDTO : list) {
            enterRoom(chatRoomListDTO.getChatRoomSeq());
        }

        return list;
    }

    public List<SearchFriendRes> searchFriend(String token, String name) {
//        Long userSeq;
//        String email;
//        String name;
//        String image;
//        // -1이면 아무관계도 아닌것, 0이면 친구요청만 된 상태,  1이면 친구
//        Integer status;
        // 토큰으로 유저 찾기
        User user = userRepository.findByUserSeq(userService.getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        List<SearchFriendRes> list = new ArrayList<>();
        List<UserResDto> userResDtoList = userService.getUserByName(token, name);
        // 1. 친구인 애들로만 거름.
        List<UserResDto> temp = new ArrayList<>();
        for (UserResDto userResDto : userResDtoList) {
            if (userResDto.getStatus() == 1) temp.add(userResDto);
        }
        // 2. 대화방이 없는 애들로만 거름.
        for (UserResDto userResDto : temp) {
            User target = userRepository.findByUserSeq(userResDto.getUserSeq()).orElseGet(User::new);
            ChatRoom chatRoom = chatRoomRepository.findByUser1AndUser2(user, target);
            if (chatRoom != null) {
                list.add(SearchFriendRes.builder()
                        .canInvite(false).image(target.getImage()).name(target.getName())
                        .userSeq(target.getUserSeq()).build());
                continue;
            }
            chatRoom = chatRoomRepository.findByUser1AndUser2(target, user);
            if (chatRoom != null) {
                list.add(SearchFriendRes.builder()
                        .canInvite(false).image(target.getImage()).name(target.getName())
                        .userSeq(target.getUserSeq()).build());
                continue;
            }
            // 채팅방이 아직 없는 경우
            list.add(SearchFriendRes.builder()
                    .canInvite(true).image(target.getImage()).name(target.getName())
                    .userSeq(target.getUserSeq()).build());
        }
        return list;

    }

    public List<Message> enterChattingRoom(Long chatRoomSeq) {
        // 읽지 않은 메시지를 전부 삭제하고 chatRoom에 보낸다.
        // chatRoomSeq에 저장된 메시지 전부 가져온다.
        List<Message> messages = messageRepository.findTop20ByChatRoomSeqOrderByRealTime(chatRoomSeq).orElseThrow(() ->
                new CustomException(ErrorCode.WRONG_DATA));
        enterRoomDetail(chatRoomSeq);
        return messages;
    }
}
