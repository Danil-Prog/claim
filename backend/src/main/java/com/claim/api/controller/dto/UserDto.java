package com.claim.api.controller.dto;

import com.claim.api.entity.user.RoleEnum;

public record UserDto(Long id,
                      String username,
                      String role,
                      String firstname,
                      String lastname,
                      String email,
                      String phone,
                      String cabinet,
                      String pc,
                      String avatar,
                      SpaceDto space) {
}
