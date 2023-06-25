package com.claim.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Table
@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "text")
    private String text;
    @Column(name = "from_username")
    private String from;
    @Column(name = "to_username")
    private String to;
    @Column(name = "message_type")
    @Enumerated(EnumType.STRING)
    private MessageType messageType;
}
