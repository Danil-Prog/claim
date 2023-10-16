package com.claim.api.controller.dto;

import com.claim.api.entity.issue.IssueStatus;
import com.claim.api.entity.issue.IssueType;

import java.util.Date;

public record IssueAllDto(Long id,
                          String title,
                          String description,
                          IssueStatus issueStatus,
                          IssueType issueType,
                          UserDto executor,
                          UserDto customer,
                          Date startDate) {
}
