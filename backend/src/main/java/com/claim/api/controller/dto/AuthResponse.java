package com.claim.api.controller.dto;

import com.claim.api.entity.Role;

public record AuthResponse(Long id, String username, Role role) {
}
