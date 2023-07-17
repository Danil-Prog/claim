package com.claim.api.controller.dto;

import com.claim.api.entity.Department;
import com.claim.api.entity.TaskStatus;
import com.claim.api.entity.TaskType;

import java.util.Date;

public record TaskDto(Long id,
                       String title,
                       String description,
                       TaskStatus taskStatus,
                       TaskType taskType,
                       Department department,
                       UserDto executor,
                       Date startDate,
                       Date endDate,
                       UserDto customer){
}