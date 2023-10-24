package com.claim.api.controller.request.issue;

import com.claim.api.entity.issue.IssueStatus;
import lombok.Data;

@Data
public class IssueStatusRequest {

    private Long id;
    private IssueStatus issueStatus;
}
