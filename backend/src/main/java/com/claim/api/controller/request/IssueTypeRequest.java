package com.claim.api.controller.request;

import com.claim.api.entity.issue.IssueType;
import lombok.Data;

@Data
public class IssueTypeRequest {

    private Long id;
    private IssueType issueType;
}
