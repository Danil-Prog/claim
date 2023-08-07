package com.claim.api.service;

import com.claim.api.controller.dto.UserDto;
import com.claim.api.entity.MessageType;
import com.claim.api.entity.User;
import com.claim.api.mapper.UserMapper;
import com.claim.api.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final Set<User> usersOnline = new HashSet<>();
    private final UserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserMapper userMapper;

    public MessageService(UserService userService, SimpMessagingTemplate simpMessagingTemplate, UserMapper userMapper) {
        this.userService = userService;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.userMapper = userMapper;
    }

    public void online(Message<String> message) {
        String username = message.getPayload();
        StompHeaderAccessor stompHeaderAccessor = StompHeaderAccessor.wrap(message);
        MessageType messageType = MessageType.valueOf(stompHeaderAccessor.getFirstNativeHeader("MessageType"));
        Optional<User> userOptional = userService.getUserByUsername(username);
        if (messageType == MessageType.SUBSCRIBE)
            userOptional.ifPresent(usersOnline::add);
        else if (messageType == MessageType.UNSUBSCRIBE)
            userOptional.ifPresent(usersOnline::remove);
        Set<UserDto> users = usersOnline.stream().map(userMapper::toUserDto).collect(Collectors.toSet());
        simpMessagingTemplate.convertAndSend("/topic/online", ResponseEntity.ok(users));
    }
}
