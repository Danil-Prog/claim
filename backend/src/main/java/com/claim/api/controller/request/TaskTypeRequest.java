package com.claim.api.controller.request;

import com.claim.api.entity.TaskType;
import lombok.Data;

@Data
public class TaskTypeRequest {

    private Long id;
    private TaskType taskType;
}
