package com.chessButBetter.chessButBetter.endpoint;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chessButBetter.chessButBetter.entity.Role;
import com.chessButBetter.chessButBetter.entity.User;

@RestController
@RequestMapping(value = "/api/authentication")
public class AuthenticationEndpoint {
    
    @GetMapping
    public User getAuthentication() {
        return new User(1L, "username", "password", "email", List.of(Role.USER));
    }
}
