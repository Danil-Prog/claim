package com.claim.api.controller;

import com.claim.api.controller.dto.AuthResponse;
import com.claim.api.controller.dto.LoginRequest;
import com.claim.api.entity.User;
import com.claim.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class AuthController {
    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/registration")
    public ResponseEntity<String> registration(@RequestBody User user) {
        if (userService.saveUser(user))
            return new ResponseEntity<>("User created", HttpStatus.OK);
        return new ResponseEntity<>("User with the same name already exists", HttpStatus.FOUND);
    }

    @PostMapping("/auth")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userService.validUsernameAndPassword(loginRequest.getUsername(), loginRequest.getPassword());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return  ResponseEntity.ok(new AuthResponse(user.getId(), user.getUsername(), user.getRole()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

}
