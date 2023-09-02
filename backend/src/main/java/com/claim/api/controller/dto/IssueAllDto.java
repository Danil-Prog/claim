package com.claim.api.controller.dto;

import com.claim.api.entity.IssueStatus;
import com.claim.api.entity.IssueType;

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
