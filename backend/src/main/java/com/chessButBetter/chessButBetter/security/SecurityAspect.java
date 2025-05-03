package com.chessButBetter.chessButBetter.security;

import java.util.Optional;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.repositories.SessionRepository;

import jakarta.servlet.http.HttpServletRequest;

@Aspect
@Component
public class SecurityAspect {

    private final Logger logger = LoggerFactory.getLogger(SecurityAspect.class);

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private SessionRepository sessionRepository;

    public Optional<User> getUserFromSession() {
        String sessionId = request.getHeader("Session-Id");
        if (sessionId == null || sessionId.isBlank()) {
            throw new SecurityException("Missing Session-Id header");
        }
        // Assuming we have a method to get user from session ID
        return getUserFromSessionId(sessionId);
    }

    private Optional<User> getUserFromSessionId(String sessionId) {
        return sessionRepository.findBySessionId(sessionId).map(session -> session.getUser());
    }

    public String getUserRoleFromSession() {
        return getUserFromSession()
                .map(User::getRole)
                .map(Enum::name)
                .orElse(null);
    }

    @Pointcut("@annotation(com.chessButBetter.chessButBetter.security.AdminOnly)")
    public void adminOnlyMethod() {}

    @Pointcut("@annotation(com.chessButBetter.chessButBetter.security.UserOnly)")
    public void userOnlyMethod() {}

    @Pointcut("@annotation(com.chessButBetter.chessButBetter.security.NoAccess)")
    public void noAccessMethod() {}

    @Pointcut("@annotation(com.chessButBetter.chessButBetter.security.NoSession)")
    public void noSessionMethod() {}

    @Before("adminOnlyMethod()")
    public void checkAdminAccess() {
        logger.info("Checking admin access");
        String role = getUserRoleFromSession();
        if (!"ADMIN".equals(role)) {
            throw new SecurityException("Admin access required");
        }
    }

    @Before("userOnlyMethod()")
    public void checkUserAccess() {
        logger.info("Checking user access");
        String role = getUserRoleFromSession();
        if (!"USER".equals(role) && !"ADMIN".equals(role)) {
            throw new SecurityException("User access required");
        }
    }

    @Before("noAccessMethod()")
    public void blockAllAccess() {
        logger.info("Blocking all access to this method");
        throw new SecurityException("Access denied");
    }

    @Before("noSessionMethod()")
    // Only allow access if no session is present
    public void checkNoSessionAccess() {
        logger.info("Checking for no session access");
        String sessionId = request.getHeader("Session-Id");
        if (sessionId != null && !sessionId.isBlank()) {
            throw new SecurityException("No session access required");
        }
    }
}
