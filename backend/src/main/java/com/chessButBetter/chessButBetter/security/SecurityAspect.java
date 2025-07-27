package com.chessButBetter.chessButBetter.security;

import java.util.Optional;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.SessionDto;
import com.chessButBetter.chessButBetter.enums.RoleType;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.repositories.SessionRepository;
import com.chessButBetter.chessButBetter.service.AbstractUserService;

import jakarta.servlet.http.HttpServletRequest;

@Aspect
@Component
public class SecurityAspect {

    private final HttpServletRequest request;

    private final SessionRepository sessionRepository;

    private final AbstractUserService abstractUserService;

    public SecurityAspect(HttpServletRequest request, SessionRepository sessionRepository, AbstractUserService abstractUserService) {
        this.request = request;
        this.sessionRepository = sessionRepository;
        this.abstractUserService = abstractUserService;
    }

    public Optional<SessionDto> getSessionFromRequest() {
        String sessionId = request.getHeader("sessionID");
        if (sessionId == null || sessionId.isBlank()) {
            return Optional.empty();
        }
        return sessionRepository.findBySessionId(sessionId).map(session -> new SessionDto(session.getSessionId(), session.getUserId().getUserId()));
    }

    public Optional<AbstractUser> getUserFromSession() throws SecurityException {
        String sessionId = request.getHeader("sessionID");
        if (sessionId == null || sessionId.isBlank()) {
            throw new SecurityException("Missing sessionID header");
        }
        // Assuming we have a method to get user from session ID
        return getUserFromSessionId(sessionId);
    }

    public AbstractUser getVerifiedUserFromSession() throws SecurityException {
        return getUserFromSession().orElseThrow(() -> new SecurityException("User not authenticated"));
    }

    public Optional<AbstractUser> getUserFromSessionId(String sessionId) {
        Long userId = sessionRepository.findBySessionId(sessionId).map(session -> session.getUserId().getUserId()).orElse(null);
        if (userId == null) {
            return Optional.empty();
        }
        return abstractUserService.getUserById(userId);
    }

    public RoleType getUserRoleFromSession() {
        return getUserFromSession()
                .map(AbstractUser::getRole)
                .orElse(null);
    }

    @Pointcut("@annotation(com.chessButBetter.chessButBetter.security.AdminOnly)")
    public void adminOnlyMethod() {}

    @Pointcut("@annotation(com.chessButBetter.chessButBetter.security.UserOnly)")
    public void userOnlyMethod() {}

    @Pointcut("@annotation(com.chessButBetter.chessButBetter.security.TempOnly)")
    public void tempOnlyMethod() {}

    @Pointcut("@annotation(com.chessButBetter.chessButBetter.security.TempMethod)")
    public void tempMethod() {}

    @Pointcut("@annotation(com.chessButBetter.chessButBetter.security.NoAccess)")
    public void noAccessMethod() {}

    @Pointcut("@annotation(com.chessButBetter.chessButBetter.security.NoSession)")
    public void noSessionMethod() {}

    @Pointcut("@annotation(com.chessButBetter.chessButBetter.security.OAuthTempOnly)")
    public void oauthTempOnlyMethod() {}

    @Before("adminOnlyMethod()")
    public void checkAdminAccess() throws SecurityException {
        RoleType role = getUserRoleFromSession();
        if (role != RoleType.ADMIN) {
            throw new SecurityException("Admin access required");
        }
    }

    @Before("userOnlyMethod()")
    public void checkUserAccess() throws SecurityException {
        RoleType role = getUserRoleFromSession();
        if (role != RoleType.USER && role != RoleType.ADMIN) {
            throw new SecurityException("User access required");
        }
    }

    @Before("tempOnlyMethod()")
    public void checkTempAccess() throws SecurityException {
        RoleType role = getUserRoleFromSession();
        if (role != RoleType.TEMP_USER) {
            throw new SecurityException("Temporary user access required");
        }
    }

    @Before("tempMethod()")
    public void checkTempMethodAccess() throws SecurityException {
        RoleType role = getUserRoleFromSession();
        if (role != RoleType.TEMP_USER && role != RoleType.USER && role != RoleType.ADMIN) {
            throw new SecurityException("At least temporary user access required");
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

    @Before("oauthTempOnlyMethod()")
    public void checkOAuthTempAccess() throws SecurityException {
        RoleType role = getUserRoleFromSession();
        if (role != RoleType.O_AUTH_TEMP_USER) {
            throw new SecurityException("OAuth temporary user access required");
        }
    }
}
