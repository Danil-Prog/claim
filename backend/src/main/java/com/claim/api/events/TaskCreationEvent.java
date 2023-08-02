package com.claim.api.events;

import com.claim.api.entity.Department;
import lombok.Data;

@Data
public class TaskCreationEvent implements CustomEvent {

    private Long id;
    private EventStatus eventStatus;
    private Department department;
    private String description;

    public TaskCreationEvent(Long id, EventStatus eventStatus, Department department, String description) {
        this.id = id;
        this.eventStatus = eventStatus;
        this.department = department;
        this.description = description;
    }
}
