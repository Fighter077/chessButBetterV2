package com.chessButBetter.chessButBetter.webSocket.controller;

import java.security.Principal;
import java.util.Optional;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.chessButBetter.chessButBetter.entity.Move;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.service.UserService;
import com.chessButBetter.chessButBetter.webSocket.listener.GameListener;
import com.chessButBetter.chessButBetter.webSocket.registry.SessionRegistry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
public class GameController {

    private final SessionRegistry sessionRegistry;
    private final UserService userService;
    private final GameListener gameListener;

    private static final Logger logger = LoggerFactory.getLogger(GameController.class);

    public GameController(SessionRegistry sessionRegistry, UserService userService, GameListener gameListener) {
        this.userService = userService;
        this.sessionRegistry = sessionRegistry;
        this.gameListener = gameListener;
    }
    
    @MessageMapping("/game/{gameId}/move")
    public void handleMove(@DestinationVariable Long gameId, @Payload Move move, Principal principal) {
        Long userId = this.sessionRegistry.getGameSessions().getUserId(principal.getName());
        Optional<AbstractUser> optionalUser = this.userService.getUserById(userId);
        if (optionalUser.isPresent()) {
            AbstractUser user = optionalUser.get();
            logger.info("User " + user.getUsername() + " made a move: " + move.getMove() + " in game: " + gameId);
            gameListener.playerMoved(user, gameId, move.getMove());
        } else {
            logger.warn("User not found for principal: " + principal.getName());
        }
    }
}
