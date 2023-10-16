package com.claim.api.controller.dto;

import com.claim.api.entity.user.Profile;
import com.claim.api.entity.user.Role;

public record UserDto(Long id, String username, Role role, Profile profile) {
}
