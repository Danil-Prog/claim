package com.claim.api.controller.request;

import com.claim.api.entity.issue.IssueStatus;
import lombok.Data;

@Data
public class IssueStatusRequest {

    private Long id;
    private IssueStatus issueStatus;
}
