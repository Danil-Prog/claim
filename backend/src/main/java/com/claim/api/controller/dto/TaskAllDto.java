package com.claim.api.controller.dto;

import com.claim.api.entity.TaskStatus;
import com.claim.api.entity.TaskType;

import java.util.Date;

public record TaskAllDto(Long id,
                         String title,
                         String description,
                         TaskStatus taskStatus,
                         TaskType taskType,
                         UserDto executor,
                         UserDto customer,
                         Date startDate) {
}
