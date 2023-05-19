package com.claim.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @Column(name = "firstname")
    private String firstname;
    @Size(min = 2, max = 20)
    @Column(name = "lastname")
    private String lastname;
    @Email
    @Column(name = "email")
    private String email;
    @Column(name = "avatar")
    @JsonIgnore
    private String avatar;
    @Size(min = 3, max = 11)
    @Column(name = "phone")
    private String phone;
    @Size(min = 2, max = 20)
    @Column(name = "cabinet")
    private String cabinet;
    @Column(name = "pc")
    private String pc;
    @OneToOne
    private Department department;
}
