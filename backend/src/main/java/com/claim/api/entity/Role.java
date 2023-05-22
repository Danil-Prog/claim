package com.claim.api.entity;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {

    ROLE_USER,
    ROLE_EXEC,
    ROLE_ADMIN,
    ROLE_SUPER_ADMIN;

    @Override
    public String getAuthority() {
        return name();
    }
}
