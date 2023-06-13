package com.claim.api.controller;

import com.claim.api.controller.dto.AuthenticationRequest;
import com.claim.api.controller.dto.AuthenticationResponse;
import com.claim.api.entity.User;
import com.claim.api.service.JwtTokenService;
import com.claim.api.service.JwtUserDetails;
import com.claim.api.service.JwtUserDetailsService;
import com.claim.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class AuthenticationController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUserDetailsService jwtUserDetailsService;
    private final JwtTokenService jwtTokenService;

    @Autowired
    public AuthenticationController(UserService userService, AuthenticationManager authenticationManager, JwtUserDetailsService jwtUserDetailsService, JwtTokenService jwtTokenService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUserDetailsService = jwtUserDetailsService;
        this.jwtTokenService = jwtTokenService;
    }

    @PostMapping("/registration")
    public ResponseEntity<String> registration(@RequestBody User user) {
        if (userService.saveUser(user))
            return new ResponseEntity<>("User created", HttpStatus.OK);
        return new ResponseEntity<>("User with the same name already exists", HttpStatus.FOUND);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest authenticationRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authenticationRequest.getUsername(), authenticationRequest.getPassword()));
        } catch (BadCredentialsException credentialsException) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        JwtUserDetails userDetails = (JwtUserDetails) jwtUserDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        String token = jwtTokenService.generateToken(userDetails);
        AuthenticationResponse response = new AuthenticationResponse(userDetails.getId(), userDetails.getUsername(), userDetails.getAuthorities(), token);

        return ResponseEntity.ok(response);
    }

}
