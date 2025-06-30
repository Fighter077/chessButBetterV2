package com.chessButBetter.chessButBetter.endpoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.chessButBetter.chessButBetter.dto.RegisterDto;
import com.chessButBetter.chessButBetter.dto.UserDto;
import com.chessButBetter.chessButBetter.entity.TempUser;
import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.exception.UserAlreadyExistsException;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.mapper.UserMapper;
import com.chessButBetter.chessButBetter.security.SecurityAspect;
import com.chessButBetter.chessButBetter.security.TempOnly;
import com.chessButBetter.chessButBetter.security.UserOnly;
import com.chessButBetter.chessButBetter.service.AbstractUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/api/user")
public class UserEndpoint {
    private final Logger logger = LoggerFactory.getLogger(UserEndpoint.class);

    private final SecurityAspect securityAspect;
    private final AbstractUserService abstractUserService;

    public UserEndpoint(SecurityAspect securityAspect, AbstractUserService abstractUserService) {
        this.securityAspect = securityAspect;
        this.abstractUserService = abstractUserService;
    }

    @UserOnly
    @GetMapping
    public UserDto getUser() {
        return UserMapper.toDto(securityAspect.getVerifiedUserFromSession());
    }

    @TempOnly
    @PostMapping("/convert")
    public AbstractUser convertTempUser(@Valid @RequestBody RegisterDto user) {
        AbstractUser toConvert = securityAspect.getVerifiedUserFromSession();
        if (toConvert instanceof TempUser) {
            TempUser toConvertTemp = (TempUser) toConvert;
            User newUser = UserMapper.fromRegisterDto(user);
            logger.info("Converting temp user to new user: " + newUser.getUsername() + " with email: " + newUser.getEmail());
            try {
                return abstractUserService.convertTempUser(toConvertTemp, newUser);
            } catch (UserAlreadyExistsException e) {
                logger.warn("Registration failed for user: " + user.getUsername());
                throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
            }
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a temp user");
    }
}
