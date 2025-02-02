package com.chessButBetter.chessButBetter.endpoint;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.enums.RoleType;

@RestController
@RequestMapping(value = "/api/authentication")
public class AuthenticationEndpoint {
    
    @GetMapping
    public User getAuthentication() {
        return new User(1L, "username", "password", "email", RoleType.USER);
    }
}
