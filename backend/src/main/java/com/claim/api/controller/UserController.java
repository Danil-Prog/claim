package com.claim.api.controller;


import com.claim.api.controller.dto.UserDto;
import com.claim.api.controller.response.SuccessfullyResponse;
import com.claim.api.entity.user.Profile;
import com.claim.api.entity.user.User;
import com.claim.api.exception.BadRequestException;
import com.claim.api.exception.UserNotFoundException;
import com.claim.api.mapper.UserMapper;
import com.claim.api.service.AttachmentService;
import com.claim.api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
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
    private final AttachmentService attachmentService;

    @Autowired
    public UserController(UserService userService,
                          UserMapper userMapper,
                          AttachmentService attachmentService) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.attachmentService = attachmentService;
    }

    @GetMapping("/{id}")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)},
            description = "Returns user by id")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/all")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)},
            description = "Gets a paginated list of users, user passwords are not taken into account")
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
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)},
            description = "Accepts the user in the request body, saves to the database")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        if (userService.saveUser(user))
            return new ResponseEntity<>("User created", HttpStatus.OK);
        throw new BadRequestException("User already exist");
    }

    @GetMapping
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)},
            description = "Returns the profile information of an authorized user")
    public ResponseEntity<UserDto> getAuthorizeUser(Principal principal) {
        UserDto user = userMapper.toUserDto(userService.getUserByUsername(principal.getName()));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/profile")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)},
            description = "Returns the profile information of an authorized user")
    public ResponseEntity<Profile> getAuthorizeUserProfile(Principal principal) {
        return ResponseEntity.ok(userService.getUserProfileByUsername(principal));
    }

    @GetMapping("/avatar/{filename}")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)},
            description = "Returns the user's photo, the user ID and photo name are passed to the parameters")
    public ResponseEntity<Resource> getUserAvatar(@PathVariable String filename) {
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(MediaType.IMAGE_GIF_VALUE))
                .body(attachmentService.getUserAvatar(filename));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)},
            description = "Deletes a user by id")
    public ResponseEntity<UserDto> removeUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.removeUserById(id));
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)},
            description = "Updated user by id")
    public ResponseEntity<UserDto> updateUserById(@PathVariable Long id, @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.update(id, userDto));
    }

    @PutMapping
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)},
            description = "Updates the profile information of an authorized user")
    public ResponseEntity<SuccessfullyResponse> updateAuthorizeUserProfile(Principal principal, @RequestBody Profile profile) {
        return ResponseEntity.ok(userService.updateAuthorizeUserProfile(principal, profile));
    }

    @PostMapping("/avatar")
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)},
            description = "Updates the profile photo of an authorized user")
    public void updateUserImage(@RequestParam("image") MultipartFile image, Principal principal) {
       attachmentService.updateUserAvatar(image, principal);
    }
}
