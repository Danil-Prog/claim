package com.claim.api.controller.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthenticationRequest {

    @NotBlank
    private String username;
    @NotBlank
    private String password;
}
