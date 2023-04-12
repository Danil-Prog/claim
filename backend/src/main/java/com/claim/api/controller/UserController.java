package com.claim.api.controller;


import com.claim.api.controller.dto.UserDto;
import com.claim.api.entity.User;
import com.claim.api.mapper.UserMapper;
import com.claim.api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static com.claim.api.config.SwaggerConfig.BASIC_AUTH_SECURITY_SCHEME;

@RestController
@RequestMapping("/api/v1/user")
@EnableMethodSecurity()
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @Autowired
    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @GetMapping("/user")
    public ResponseEntity<List<UserDto>> getUsers() {
        return new ResponseEntity<>(userService.getUserList().stream()
                .map(userMapper::toUserDto)
                .collect(Collectors.toList()), HttpStatus.OK);
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User user) {
        if (userService.saveUser(user))
            return new ResponseEntity<>("User created", HttpStatus.OK);
        return new ResponseEntity<>("User with the same name already exists", HttpStatus.FOUND);
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<User> removeUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.removeUserById(id));
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @PostMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.update(id, user));
    }
}
