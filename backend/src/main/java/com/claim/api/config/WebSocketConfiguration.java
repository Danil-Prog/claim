package com.claim.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer  {

    @Value("${rabbit.configure.user}")
    private String RABBIT_USER;
    @Value("${rabbit.configure.password}")
    private String RABBIT_PASSWORD;

    @Value("${rabbit.configure.host}")
    private String RABBIT_HOST;
    @Value("${rabbit.configure.port}")
    private int RABBIT_PORT;


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws");
        registry.addEndpoint("/ws").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableStompBrokerRelay("/topic", "/queue")
                .setRelayHost(RABBIT_HOST)
                .setRelayPort(RABBIT_PORT)
                .setClientLogin(RABBIT_USER)
                .setClientPasscode(RABBIT_PASSWORD)
                .setSystemLogin(RABBIT_USER)
                .setSystemPasscode(RABBIT_PASSWORD);
    }
}