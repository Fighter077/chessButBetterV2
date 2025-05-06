package com.chessButBetter.chessButBetter.security;

import java.util.Optional;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.SessionDto;
import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.repositories.SessionRepository;

import jakarta.servlet.http.HttpServletRequest;

@Aspect
@Component
public class SecurityAspect {

    private final HttpServletRequest request;

    private final SessionRepository sessionRepository;

    public SecurityAspect(HttpServletRequest request, SessionRepository sessionRepository) {
        this.request = request;
        this.sessionRepository = sessionRepository;
    }

    public Optional<SessionDto> getSessionFromRequest() {
        String sessionId = request.getHeader("sessionID");
        if (sessionId == null || sessionId.isBlank()) {
            return Optional.empty();
        }
        return sessionRepository.findBySessionId(sessionId).map(session -> new SessionDto(session.getSessionId(), session.getUser().getId()));
    }

    public Optional<User> getUserFromSession() throws SecurityException {
        String sessionId = request.getHeader("sessionID");
        if (sessionId == null || sessionId.isBlank()) {
            throw new SecurityException("Missing sessionID header");
        }
        // Assuming we have a method to get user from session ID
        return getUserFromSessionId(sessionId);
    }

    public User getVerifiedUserFromSession() throws SecurityException {
        return getUserFromSession().orElseThrow(() -> new SecurityException("User not authenticated"));
    }

    public Optional<User> getUserFromSessionId(String sessionId) {
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
    public void checkAdminAccess() throws SecurityException {
        String role = getUserRoleFromSession();
        if (!"ADMIN".equals(role)) {
            throw new SecurityException("Admin access required");
        }
    }

    @Before("userOnlyMethod()")
    public void checkUserAccess() throws SecurityException {
        String role = getUserRoleFromSession();
        if (!"USER".equals(role) && !"ADMIN".equals(role)) {
            throw new SecurityException("User access required");
        }
    }

    @Before("noAccessMethod()")
    public void blockAllAccess() throws SecurityException {
        throw new SecurityException("Access denied");
    }

    @Before("noSessionMethod()")
    // Only allow access if no session is present
    public void checkNoSessionAccess() throws SecurityException {
        String sessionId = request.getHeader("Session-Id");
        if (sessionId != null && !sessionId.isBlank()) {
            throw new SecurityException("No session access required");
        }
    }
}
