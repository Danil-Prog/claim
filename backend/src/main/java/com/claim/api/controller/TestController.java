package com.claim.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/home")
    public ResponseEntity<String> home(){
        return new ResponseEntity<>("Home page", HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<String> init(){
        return new ResponseEntity<>("Main page", HttpStatus.OK);
    }

}
