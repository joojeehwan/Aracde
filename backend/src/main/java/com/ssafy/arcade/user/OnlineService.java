package com.ssafy.arcade.user;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.ssafy.arcade.common.RedisPublisher;
import com.ssafy.arcade.common.RedisSubscriber;
import com.ssafy.arcade.common.exception.CustomException;
import com.ssafy.arcade.common.exception.ErrorCode;
import com.ssafy.arcade.common.util.JwtTokenUtil;
import com.ssafy.arcade.user.entity.User;
import com.ssafy.arcade.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OnlineService {
    private final UserRepository userRepository;
    private final RedisMessageListenerContainer redisMessageListener;
    private final RedisSubscriber redisSubscriber;
    private Map<String, ChannelTopic> channels;

    @PostConstruct
    public void init() {
        channels = new HashMap<>();
    }
    public Map<String, ChannelTopic> getChannels(){
        return this.channels;
    }
    // JWT 토큰으로 유저 조회
    public Long getUserSeqByToken(String token) {
        JWTVerifier verifier = JwtTokenUtil.getVerifier();
        if ("".equals(token)) {
            throw new CustomException(ErrorCode.NOT_OUR_USER);
        }
        JwtTokenUtil.handleError(token);
        DecodedJWT decodedJWT = verifier.verify(token.replace(JwtTokenUtil.TOKEN_PREFIX, ""));
        return Long.parseLong(decodedJWT.getSubject());
    }

    // 로그인 했을때
    public ChannelTopic logined(Long userSeq) {
        ChannelTopic topic = channels.get("/sub/" + userSeq);
        // 토픽이 없으면 만든다.
        if (topic == null) {
            topic = new ChannelTopic("/sub/" + userSeq);
            redisMessageListener.addMessageListener(redisSubscriber, topic);
            channels.put("/sub/" + userSeq, topic);
        }
        return topic;
    }

    public String online(String token) {
        // 토큰으로 유저 찾기
        User user = userRepository.findByUserSeq(getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        logined(user.getUserSeq());
        return "OK";
    }

    public String out(String token) {
        // 토큰으로 유저 찾기
        User user = userRepository.findByUserSeq(getUserSeqByToken(token)).orElseThrow(() ->
                new CustomException(ErrorCode.NOT_OUR_USER));
        if (getTopicName(user.getUserSeq()) != null) {
            ChannelTopic topic = channels.get(getTopicName(user.getUserSeq()));
            redisMessageListener.removeMessageListener(redisSubscriber, topic);
            channels.remove(getTopicName(user.getUserSeq()));
        }
        return "OK";
    }

    public String getTopicName(Long userSeq) {
        if (channels.containsKey("/sub/" + userSeq)) {
            return "/sub/" + userSeq;
        } else return null;
    }

    public ChannelTopic getOnlineTopic(Long userSeq) {
        return channels.getOrDefault("/sub/" + userSeq, null);
    }
}
