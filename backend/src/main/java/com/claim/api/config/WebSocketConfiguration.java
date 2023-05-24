package com.claim.api.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration;
import org.springframework.boot.autoconfigure.amqp.RabbitConnectionFactoryBeanConfigurer;
import org.springframework.boot.autoconfigure.amqp.RabbitProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer  {

    @Autowired
    private RabbitProperties rabbitProperties;


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws");
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3000");
        registry.addEndpoint("/ws").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableStompBrokerRelay("/topic")
                .setRelayHost(rabbitProperties.getHost())
                .setRelayPort(rabbitProperties.getPort())
                .setClientLogin(rabbitProperties.getUsername())
                .setClientPasscode(rabbitProperties.getPassword())
                .setSystemLogin(rabbitProperties.getUsername())
                .setSystemPasscode(rabbitProperties.getPassword());
        config.setApplicationDestinationPrefixes("/app");
    }
}