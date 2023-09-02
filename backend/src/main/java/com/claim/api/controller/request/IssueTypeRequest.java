package com.claim.api.controller.request;

import com.claim.api.entity.IssueType;
import lombok.Data;

@Data
public class IssueTypeRequest {

    private Long id;
    private IssueType issueType;
}
