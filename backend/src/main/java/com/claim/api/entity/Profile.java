package com.claim.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "profile")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(min = 3, max = 20)
    @NotNull
    @Column(name = "firstname")
    private String firstname;
    @Size(min = 2, max = 20)
    @NotNull
    @Column(name = "lastname")
    private String lastname;
    @Email
    @NotNull
    @Column(name = "email")
    private String email;
    @Column(name = "avatar")
    private String avatar;
    @OneToMany(mappedBy = "uploaded", fetch = FetchType.EAGER)
    private Set<Attachment> attachments = new HashSet<>();
    @Size(min = 3, max = 11)
    @NotNull
    @Column(name = "phone")
    private String phone;
    @Size(min = 2, max = 20)
    @NotNull
    @Column(name = "cabinet")
    private String cabinet;
    @NotNull
    @Column(name = "pc")
    private String pc;
    @NotNull
    @OneToOne
    private Department department;
}