package com.claim.api.controller.request;

import com.claim.api.entity.TaskStatus;
import lombok.Data;

@Data
public class TaskStatusRequest {

    private Long id;
    private TaskStatus taskStatus;
}
