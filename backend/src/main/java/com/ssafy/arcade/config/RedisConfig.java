package com.ssafy.arcade.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

//@EnableCaching
//@Configuration
public class RedisConfig {
    // springboot 2.0 이상부터 그냥 properties에 적으면 된다고 함.

//    @Value("${spring.redis.host}")
//    private String host;
//
//    @Value("${spring.redis.port}")
//    private int port;
//    @Value("${spring.redis.password}")
//    private String password;
//
//    // Lettuce 사용. 내장된 redis가 아닌 로컬 redis 사용
//    @Bean
//    public RedisConnectionFactory redisConnectionFactory() {
//        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
//        // Host 설정
//        redisStandaloneConfiguration.setHostName(host);
//        // Port 설정
//        redisStandaloneConfiguration.setPort(port);
//        // password 설정
//        redisStandaloneConfiguration.setPassword(password);
//        return new LettuceConnectionFactory(redisStandaloneConfiguration);
//    }
//
//    // redisTemplate을 사용하기 위한 설정. CRUD 는 이거 안쓸거임
//    @Bean
//    public RedisTemplate<?, ?> redisTemplate() {
//        RedisTemplate<?, ?> redisTemplate = new RedisTemplate<>();
//        redisTemplate.setConnectionFactory(redisConnectionFactory());
//        return redisTemplate;
//    }
//    // redis의 pub/sub 을 사용하기 위한 설정
//    public RedisTemplate<String, Object> redisTemplateForObject(RedisConnectionFactory connectionFactory) {
//        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
//        redisTemplate.setConnectionFactory(connectionFactory);
//        redisTemplate.setKeySerializer(new StringRedisSerializer());
//        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(String.class));
//        return redisTemplate;
//
//    }
//
//    // 지속적인 메시지 발행을 체크하기 위한 리스너
//    @Bean
//    public RedisMessageListenerContainer redisMessageListener(RedisConnectionFactory connectionFactory) {
//        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
//        container.setConnectionFactory(connectionFactory);
//        return container;
//    }
}