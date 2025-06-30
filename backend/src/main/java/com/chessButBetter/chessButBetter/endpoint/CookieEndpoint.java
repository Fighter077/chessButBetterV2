package com.chessButBetter.chessButBetter.endpoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chessButBetter.chessButBetter.dto.CookieConsentDto;
import com.chessButBetter.chessButBetter.dto.SessionDto;
import com.chessButBetter.chessButBetter.dto.UserDto;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.mapper.UserMapper;
import com.chessButBetter.chessButBetter.security.SecurityAspect;
import com.chessButBetter.chessButBetter.security.UserOnly;
import com.chessButBetter.chessButBetter.service.CookieService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/api/cookies")
public class CookieEndpoint {
    private final Logger logger = LoggerFactory.getLogger(CookieEndpoint.class);

    private final SecurityAspect securityAspect;
    private final CookieService cookieService;

    public CookieEndpoint(SecurityAspect securityAspect, CookieService cookieService) {
        this.securityAspect = securityAspect;
        this.cookieService = cookieService;
    }

    @UserOnly
    @GetMapping
    public UserDto getUser() {
        return UserMapper.toDto(securityAspect.getVerifiedUserFromSession());
    }

    @PostMapping("/consent")
    public void convertTempUser(HttpServletRequest request, @Valid @RequestBody CookieConsentDto consent) {
        AbstractUser user = null;
        SessionDto session = null;
        try {
            session = securityAspect.getSessionFromRequest().orElse(null);
        } catch (SecurityException e) {
            logger.warn("Session ID not found in session");
        }
        try {
            user = securityAspect.getVerifiedUserFromSession();
        } catch (SecurityException e) {
            logger.warn("User not found in session");
        }
        cookieService.storeAcceptance(consent, user, session != null ? session.getSessionId() : null, request.getRemoteAddr());
    }
}
