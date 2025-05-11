package com.chessButBetter.chessButBetter.endpoint;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.security.SecurityAspect;
import com.chessButBetter.chessButBetter.security.UserOnly;

@RestController
@RequestMapping(value = "/api/user")
public class UserEndpoint {

    private final SecurityAspect securityAspect;

    public UserEndpoint(SecurityAspect securityAspect) {
        this.securityAspect = securityAspect;
    }

    @UserOnly
    @GetMapping
    public AbstractUser getUser() {
        return securityAspect.getVerifiedUserFromSession();
    }
}
