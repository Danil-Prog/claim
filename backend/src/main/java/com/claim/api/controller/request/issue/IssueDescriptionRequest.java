package com.claim.api.controller.request.issue;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class IssueDescriptionRequest {

    @NotEmpty
    private Long id;

    @NotEmpty
    private String description;
}
