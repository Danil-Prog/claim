package com.claim.api.controller.dto;

import com.claim.api.entity.issue.IssueStatus;

public record SubTaskDto (Long id,
                          String title,
                          IssueStatus issueStatus,
                          UserDto executor) {
}
