package com.chessButBetter.chessButBetter.webSocket;

import java.security.Principal;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.security.SecurityAspect;
import com.chessButBetter.chessButBetter.service.AbstractUserService;
import com.chessButBetter.chessButBetter.webSocket.listener.GameListener;
import com.chessButBetter.chessButBetter.webSocket.listener.QueueListener;
import com.chessButBetter.chessButBetter.webSocket.registry.SessionRegistry;
import com.chessButBetter.chessButBetter.webSocket.registry.SessionStorage;

@Configuration
public class WebSocketSecurityConfig implements WebSocketMessageBrokerConfigurer {

    private final SecurityAspect securityAspect;
    private final AbstractUserService abstractUserService;
    private final QueueListener queueListener;
    private final GameListener gameListener;

    private final SessionRegistry sessionRegistry;

    @Autowired
    public WebSocketSecurityConfig(SecurityAspect securityAspect, AbstractUserService abstractUserService,
            QueueListener queueListener, GameListener gameListener, SessionRegistry sessionRegistry) {
        this.securityAspect = securityAspect;
        this.abstractUserService = abstractUserService;
        this.queueListener = queueListener;
        this.gameListener = gameListener;
        this.sessionRegistry = sessionRegistry;
    }

    private static final Logger logger = LoggerFactory.getLogger(WebSocketSecurityConfig.class);

    @SuppressWarnings("null")
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    executeConnectEvent(accessor);
                } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                    CompletableFuture.runAsync(() -> executeSubscribeEvent(accessor));
                } else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                    CompletableFuture.runAsync(() -> executeDisconnectEvent(accessor));
                } else if (StompCommand.UNSUBSCRIBE.equals(accessor.getCommand())) {
                    CompletableFuture.runAsync(() -> executeDisconnectEvent(accessor));
                } else if (StompCommand.SEND.equals(accessor.getCommand())) {
                    // CompletableFuture.runAsync(() -> executeSendEvent(accessor));
                }
                return message;
            }
        });
    }

    private void executeConnectEvent(StompHeaderAccessor accessor) {
        String sessionId = accessor.getSessionId();
        String mainSessionID = accessor.getFirstNativeHeader("sessionID");
        String wsType = accessor.getFirstNativeHeader("wsType");
        SessionStorage sessionStorage = getSessionStorage(wsType);

        if (mainSessionID != null) {
            Optional<AbstractUser> user = securityAspect.getUserFromSessionId(mainSessionID);
            if (user.isEmpty()) {
                return;
            }
            AbstractUser applicationUser = user.get();

            sessionRegistry.addSession(sessionId, wsType);
            sessionStorage.register(applicationUser.getId().getUserId(), sessionId);

            Principal principal = () -> sessionId;
            accessor.setUser(principal);
        }
    }

    private void executeSubscribeEvent(StompHeaderAccessor accessor) {
        logger.info("User subscribed to topic: {}", accessor.getDestination());
        Principal sessionIdPrincipal = accessor.getUser();
        if (sessionIdPrincipal == null) {
            logger.warn("Session ID principal is null");
            return;
        }
        String sessionId = sessionIdPrincipal.getName();
        String wsType = getWsType(sessionId);
        SessionStorage sessionStorage = getSessionStorage(wsType);
        Long userId = sessionStorage.getUserId(sessionId);
        if (userId == null) {
            logger.warn("User Id of session {} not found", sessionId);
        } else {
            Optional<AbstractUser> user = abstractUserService.getUserById(userId);
            if (user.isEmpty()) {
                logger.error("User not found: {}", userId);
                throw new BadCredentialsException("User not found: " + userId);
            }
            if (wsType == null) {
                logger.warn("WebSocket type is null for session: {}", sessionId);
                return;
            }
            Long gameId = null;
            if (wsType.equals("game")) {
                gameId = getGameIdFromDestination(accessor.getDestination());
            }
            handleConnected(wsType, user.get(), gameId);
        }
    }

    private void executeDisconnectEvent(StompHeaderAccessor accessor) {
        String sessionId = accessor.getSessionId();
        SessionStorage sessionStorage = getSessionStorage(getWsType(sessionId));
        Long userId = sessionStorage.getUserId(sessionId);
        if (userId == null) {
            logger.error("User Id of session {} not found", sessionId);
        } else {
            Optional<AbstractUser> user = abstractUserService.getUserById(userId);
            if (user.isEmpty()) {
                logger.error("User not found: {}", userId);
                throw new BadCredentialsException("User not found: " + userId);
            }
            String wsType = getWsType(sessionId);
            if (wsType == null) {
                logger.warn("WebSocket type is null for session: {}", sessionId);
                return;
            }
            Long gameId = null;
            if (wsType.equals("game")) {
                gameId = getGameIdFromDestination(accessor.getDestination());
            }
            handleDisconnected(wsType, user.get(), gameId);
        }
        sessionStorage.unregisterSession(sessionId);
    }

    private SessionStorage getSessionStorage(String wsType) {
        if (wsType == null) {
            logger.warn("WebSocket type is null");
            return null;
        }
        if (wsType.equals("queue")) {
            return sessionRegistry.getQueueSessions();
        } else if (wsType.equals("game")) {
            return sessionRegistry.getGameSessions();
        } else {
            logger.warn("Unknown WebSocket type: {}", wsType);
            return null;
        }
    }

    private String getWsType(String sessionID) {
        return sessionRegistry.getSessionType(sessionID);
    }

    private void handleConnected(String wsType, AbstractUser user, Long gameId) {
        if (wsType.equals("queue")) {
            queueListener.lookForMatch(user);
        } else if (wsType.equals("game")) {
            gameListener.playerConnected(user, gameId);
        } else {
            logger.warn("Unknown WebSocket type: {}", wsType);
        }
    }

    private void handleDisconnected(String wsType, AbstractUser user, Long gameId) {
        if (wsType.equals("queue")) {
            queueListener.cancelMatch(user);
        } else if (wsType.equals("game")) {
            gameListener.playerDisconnected(user, gameId);
        } else {
            logger.warn("Unknown WebSocket type: {}", wsType);
        }
    }

    private Long getGameIdFromDestination(String destination) {
        if (destination == null) {
            logger.warn("Destination is null");
            return null;
        }
        String[] parts = destination.split("/");
        if (parts.length > 2) {
            try {
                return Long.parseLong(parts[2]);
            } catch (NumberFormatException e) {
                logger.error("Invalid game ID in destination: {}", destination, e);
            }
        }
        return null;
    }
}