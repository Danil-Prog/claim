package com.claim.api.events;

import lombok.Data;

@Data
public class UserCreationEvent implements CustomEvent {

    private String username;
    private EventStatus eventStatus;

    public UserCreationEvent(String username, EventStatus eventStatus) {
        this.username = username;
        this.eventStatus = eventStatus;
    }
}
