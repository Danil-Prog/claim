package com.claim.api.controller.request.issue;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class IssueTitleRequest {

    @NotEmpty
    private Long id;

    @NotEmpty
    private String title;
}
