package com.claim.api.controller.response;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public record AuthenticationResponse(Long id, String username, Collection<? extends GrantedAuthority> authorities, String token) {
}
