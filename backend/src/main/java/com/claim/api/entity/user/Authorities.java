package com.claim.api.entity.user;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;


@Data
@Table(name = "role")
@Entity
public class Authorities implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RoleEnum role;

    @ElementCollection(targetClass = PrivilegeEnum.class, fetch = FetchType.EAGER)
    @JoinTable(name = "user_privileges", joinColumns = @JoinColumn(name = "role_id"))
    @Column(name = "privileges", nullable = false)
    @Enumerated(EnumType.STRING)
    private List<PrivilegeEnum> privileges;

    @Override
    public String getAuthority() {
        return role.name();
    }
}
