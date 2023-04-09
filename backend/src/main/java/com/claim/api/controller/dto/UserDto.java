package com.claim.api.controller.dto;

import com.claim.api.entity.Role;

public record UserDto(Long id, String username, Role role) {
}
