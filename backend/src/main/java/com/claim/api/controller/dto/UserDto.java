package com.claim.api.controller.dto;

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
