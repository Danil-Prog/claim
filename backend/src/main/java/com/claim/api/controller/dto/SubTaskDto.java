package com.claim.api.controller.dto;

import com.claim.api.entity.TaskStatus;

public record SubTaskDto (Long id,
                          String title,
                          TaskStatus taskStatus,
                          UserDto executor) {
}
