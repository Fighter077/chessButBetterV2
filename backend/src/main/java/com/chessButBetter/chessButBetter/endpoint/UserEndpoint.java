package com.chessButBetter.chessButBetter.endpoint;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/users")
public class UserEndpoint {
    
    @GetMapping
    public String getUsers() {
        return "Hello, users!";
    }
}
