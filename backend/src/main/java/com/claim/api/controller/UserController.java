package com.claim.api.controller;


import com.claim.api.controller.dto.UserDto;
import com.claim.api.entity.Profile;
import com.claim.api.entity.User;
import com.claim.api.mapper.UserMapper;
import com.claim.api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

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

    @GetMapping("/{id}")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/all")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<Page<UserDto>> getUsers(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size,
                                                  @RequestParam(defaultValue = "ASC") String sortBy,
                                                  @RequestParam(defaultValue = "id") String[] sort) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortBy), sort));
        Page<UserDto> users = userService.getUserList(pageRequest).map(userMapper::toUserDto);
        return ResponseEntity.ok(users);
    }


    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<String> createUser(@RequestBody User user) {
        if (userService.saveUser(user))
            return new ResponseEntity<>("User created", HttpStatus.OK);
        return new ResponseEntity<>("User with the same name already exists", HttpStatus.FOUND);
    }

    @GetMapping
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<Profile> getAuthorizeUserProfile(Principal principal) {
        return ResponseEntity.ok(userService.getUserByUsername(principal));
    }

    @GetMapping("/{id}/avatar/{filename}")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<byte[]> getUserAvatar(@PathVariable Long id,
                                                @PathVariable String filename) {
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(MediaType.IMAGE_GIF_VALUE))
                .body(userService.getUserAvatar(id, filename));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<User> removeUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.removeUserById(id));
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<UserDto> updateUserById(@PathVariable Long id, @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.update(id, userDto));
    }

    @PutMapping
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<String> updateAuthorizeUserProfile(Principal principal, @RequestBody Profile profile) {
        return ResponseEntity.ok(userService.updateAuthorizeUserProfile(principal, profile));
    }

    @PostMapping("/avatar")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<String> updateUserImage(@RequestParam("image") MultipartFile image, Principal principal) {
        return ResponseEntity.ok(userService.updateUserImage(image, principal));
    }
}