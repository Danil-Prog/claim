package com.claim.api.controller.dto;

import com.claim.api.entity.Department;
import com.claim.api.entity.StatusTask;

import java.util.Date;

public record TaskDto(Long id,
                       String title,
                       String description,
                       StatusTask statusTask,
                       Department department,
                       UserDto executor,
                       Date startDate,
                       Date endDate,
                       UserDto customer){
}