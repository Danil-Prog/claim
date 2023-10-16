package com.claim.api.controller.dto;

import com.claim.api.entity.space.Space;
import com.claim.api.entity.issue.IssueStatus;
import com.claim.api.entity.issue.IssueType;

import java.util.Date;
import java.util.List;

public record IssueDto(Long id,
                       String title,
                       String description,
                       IssueStatus issueStatus,
                       IssueType issueType,
                       Space space,
                       List<SubTaskDto> subtasks,
                       UserDto executor,
                       Date startDate,
                       Date endDate,
                       UserDto customer){
}
