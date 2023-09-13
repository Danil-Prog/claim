package com.claim.api.events;

import lombok.Data;

@Data
public class CommentCreationEvent {

    private Long issueId;
    private String username;
    private String text;

    public CommentCreationEvent(Long issueId, String username, String text) {
        this.issueId = issueId;
        this.username = username;
        this.text = text;
    }
}
