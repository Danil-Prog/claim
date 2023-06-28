package com.claim.api.controller;

import com.claim.api.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;

    @Autowired
    public MessageController(SimpMessagingTemplate simpMessagingTemplate, MessageService messageService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.messageService = messageService;
    }

    @MessageMapping("/chat")
    public Message<String> send(Message<String> message) {
        simpMessagingTemplate.convertAndSend("/topic/public", message);
        return message;
    }

    @MessageMapping("/online")
    public void online(Message<String> message) {
        messageService.online(message);
    }

}