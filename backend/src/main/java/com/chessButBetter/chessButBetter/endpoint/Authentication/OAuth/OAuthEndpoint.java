package com.chessButBetter.chessButBetter.endpoint.Authentication.OAuth;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.chessButBetter.chessButBetter.dto.OAuthUserInfo;
import com.chessButBetter.chessButBetter.entity.OAuthTempUser;
import com.chessButBetter.chessButBetter.entity.Session;
import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.service.OAuthService;
import com.chessButBetter.chessButBetter.service.SessionService;
import com.chessButBetter.chessButBetter.service.UserService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/authentication/login/oauth")
public class OAuthEndpoint {

    private final Map<String, OAuthService> providers;
    private final UserService userService;
    private final SessionService sessionService;

    @Value("${oauth.frontend-uri}")
    private String frontendUri;

    public OAuthEndpoint(List<OAuthService> services, UserService userService, SessionService sessionService) {
        this.userService = userService;
        this.sessionService = sessionService;

        // Map bean names to provider keys (google, github, etc.)
        this.providers = services.stream().collect(Collectors.toMap(
                s -> s.getClass().getSimpleName().replace("OAuthService", "").toLowerCase(),
                s -> s));
    }

    @GetMapping("/{provider}")
    public void redirectToProvider(@PathVariable String provider, HttpServletResponse response) throws IOException {
        OAuthService oauth = providers.get(provider);
        if (oauth == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Provider not supported");
        response.sendRedirect(oauth.buildAuthorizationUrl());
    }

    @GetMapping("/{provider}/callback")
    public void handleCallback(@PathVariable String provider, @RequestParam String code, HttpServletResponse response)
            throws IOException {
        OAuthService oauth = providers.get(provider);
        if (oauth == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Provider not supported");

        OAuthUserInfo userInfo = oauth.getUserInfo(code);
        User user = userService.loginOAuthUser(userInfo);
        Session session;
        if (user == null) {
            OAuthTempUser oauthUser = userService.registerOAuthUser(provider, userInfo);
            session = sessionService.createSession(oauthUser);
        } else {
            session = sessionService.createSession(user);
        }
        response.sendRedirect(frontendUri + "/login/success?sessionId=" + session.getSessionId());
    }
}
