package com.claim.api.events;

import lombok.Data;

@Data
public class TaskCreationEvent implements CustomEvent {

    private EventStatus eventStatus;
    private String departmentShortName;
    private String title;

    public TaskCreationEvent(EventStatus eventStatus, String departmentShortName, String title) {
        this.eventStatus = eventStatus;
        this.departmentShortName = departmentShortName;
        this.title = title;
    }
}
