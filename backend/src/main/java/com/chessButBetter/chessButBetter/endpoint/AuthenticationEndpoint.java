package com.chessButBetter.chessButBetter.endpoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.chessButBetter.chessButBetter.dto.LoginDto;
import com.chessButBetter.chessButBetter.dto.UserDto;
import com.chessButBetter.chessButBetter.dto.SessionDto;
import com.chessButBetter.chessButBetter.entity.Session;
import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.exception.InvalidPasswordException;
import com.chessButBetter.chessButBetter.exception.UserAlreadyExistsException;
import com.chessButBetter.chessButBetter.exception.UserNotFoundException;
import com.chessButBetter.chessButBetter.mapper.UserMapper;
import com.chessButBetter.chessButBetter.security.NoSession;
import com.chessButBetter.chessButBetter.security.SecurityAspect;
import com.chessButBetter.chessButBetter.security.UserOnly;
import com.chessButBetter.chessButBetter.service.SessionService;
import com.chessButBetter.chessButBetter.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/api/authentication")
public class AuthenticationEndpoint {

    private final Logger logger = LoggerFactory.getLogger(AuthenticationEndpoint.class);

    private final UserService userService;
    private final SessionService sessionService;
    private final SecurityAspect securityAspect;

    public AuthenticationEndpoint(UserService userService, SessionService sessionService, SecurityAspect securityAspect) {
        this.userService = userService;
        this.sessionService = sessionService;
        this.securityAspect = securityAspect;
    }


    @NoSession
    @PostMapping("/login")
    public SessionDto login(@Valid @RequestBody LoginDto user) {
        logger.info("Login attempt for user: " + user.getUsername());
        User loggedInUser = null;
        try {
            loggedInUser = userService.loginUser(UserMapper.fromLoginDto(user));
        } catch (UserNotFoundException | InvalidPasswordException e) {
            logger.warn("Login failed for user: " + user.getUsername());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
        Session sessionCreated = sessionService.createSession(loggedInUser);
        SessionDto session = new SessionDto(sessionCreated.getSessionId(), sessionCreated.getUserId().getUserId());
        logger.info("User logged in successfully: " + session.getUserId());
        return session;
    }

    @NoSession
    @PostMapping("/register")
    public SessionDto register(@Valid @RequestBody UserDto user) {
        logger.info("Registering user: " + user.getUsername());
        User registeredUser = null;
        try {
            registeredUser = userService.registerUser(UserMapper.fromDto(user));
        } catch (UserAlreadyExistsException e) {
            logger.warn("Registration failed for user: " + user.getUsername());
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
        Session sessionCreated = sessionService.createSession(registeredUser);
        SessionDto session = new SessionDto(sessionCreated.getSessionId(), sessionCreated.getUserId().getUserId());
        logger.info("User registered successfully: " + session.getUserId());
        return session;
    }

    @UserOnly
    @PostMapping("/logout")
    public void logout() {
        logger.info("Logging out user: " + securityAspect.getUserFromSession()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated")).getUsername());
        sessionService.deleteSessionById(securityAspect.getSessionFromRequest()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session not found")).getSessionId());
        logger.info("User logged out successfully");
    }
}
