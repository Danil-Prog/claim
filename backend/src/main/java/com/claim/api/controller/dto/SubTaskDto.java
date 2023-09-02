package com.claim.api.controller.dto;

import com.claim.api.entity.IssueStatus;

public record SubTaskDto (Long id,
                          String title,
                          IssueStatus issueStatus,
                          UserDto executor) {
}
