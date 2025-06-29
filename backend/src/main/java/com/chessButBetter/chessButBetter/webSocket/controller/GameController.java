package com.chessButBetter.chessButBetter.webSocket.controller;

import java.security.Principal;
import java.util.Optional;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.chessButBetter.chessButBetter.entity.Move;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.service.AbstractUserService;
import com.chessButBetter.chessButBetter.webSocket.listener.GameListener;
import com.chessButBetter.chessButBetter.webSocket.registry.SessionRegistry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
public class GameController {

    private final SessionRegistry sessionRegistry;
    private final AbstractUserService abstractUserService;
    private final GameListener gameListener;

    private static final Logger logger = LoggerFactory.getLogger(GameController.class);

    public GameController(SessionRegistry sessionRegistry, AbstractUserService abstractUserService, GameListener gameListener) {
        this.abstractUserService = abstractUserService;
        this.sessionRegistry = sessionRegistry;
        this.gameListener = gameListener;
    }
    
    @MessageMapping("/game/{gameId}/move")
    public void handleMove(@DestinationVariable Long gameId, @Payload Move move, Principal principal) {
        // Check if the user is authenticated
        if (principal == null) {
            logger.warn("User is not authenticated");
            return;
        }
        Long userId = this.sessionRegistry.getGameSessions().getUserId(principal.getName());
        if (userId == null) {
            logger.warn("User ID not found for principal: " + principal.getName());
            return;
        }
        Optional<AbstractUser> optionalUser = this.abstractUserService.getUserById(userId);
        if (optionalUser.isPresent()) {
            AbstractUser user = optionalUser.get();
            logger.info("User " + user.getUsername() + " made a move: " + move.getMove() + " in game: " + gameId);
            gameListener.playerMoved(user, gameId, move.getMove());
        } else {
            logger.warn("User not found for principal: " + principal.getName());
        }
    }

    @MessageMapping("/game/{gameId}/check-timeout")
    public void handleCheckTimeout(@DestinationVariable Long gameId, Principal principal) {
            logger.info("Checking timeout for game: " + gameId);
            gameListener.checkTimeout(gameId);
    }

    @MessageMapping("/game/{gameId}/resign")
    public void handleResign(@DestinationVariable Long gameId, Principal principal) {
        // Check if the user is authenticated
        if (principal == null) {
            logger.warn("User is not authenticated");
            return;
        }
        Long userId = this.sessionRegistry.getGameSessions().getUserId(principal.getName());
        if (userId == null) {
            logger.warn("User ID not found for principal: " + principal.getName());
            return;
        }
        Optional<AbstractUser> optionalUser = this.abstractUserService.getUserById(userId);
        if (optionalUser.isPresent()) {
            AbstractUser user = optionalUser.get();
            logger.info("User " + user.getUsername() + " resigned in game: " + gameId);
            gameListener.playerResigned(user, gameId);
        } else {
            logger.warn("User not found for principal: " + principal.getName());
        }
    }

    @MessageMapping("/game/{gameId}/draw")
    public void handleDraw(@DestinationVariable Long gameId, Principal principal) {
        // Check if the user is authenticated
        if (principal == null) {
            logger.warn("User is not authenticated");
            return;
        }
        Long userId = this.sessionRegistry.getGameSessions().getUserId(principal.getName());
        if (userId == null) {
            logger.warn("User ID not found for principal: " + principal.getName());
            return;
        }
        Optional<AbstractUser> optionalUser = this.abstractUserService.getUserById(userId);
        if (optionalUser.isPresent()) {
            AbstractUser user = optionalUser.get();
            logger.info("User " + user.getUsername() + " offered a draw in game: " + gameId);
            gameListener.playerOfferedDraw(user, gameId);
        } else {
            logger.warn("User not found for principal: " + principal.getName());
        }
    }

    @MessageMapping("/game/{gameId}/cancel-draw")
    public void handleCancelDraw(@DestinationVariable Long gameId, Principal principal) {
        // Check if the user is authenticated
        if (principal == null) {
            logger.warn("User is not authenticated");
            return;
        }
        Long userId = this.sessionRegistry.getGameSessions().getUserId(principal.getName());
        if (userId == null) {
            logger.warn("User ID not found for principal: " + principal.getName());
            return;
        }
        Optional<AbstractUser> optionalUser = this.abstractUserService.getUserById(userId);
        if (optionalUser.isPresent()) {
            AbstractUser user = optionalUser.get();
            logger.info("User " + user.getUsername() + " canceled a draw in game: " + gameId);
            gameListener.playerCanceledDraw(user, gameId);
        } else {
            logger.warn("User not found for principal: " + principal.getName());
        }
    }
}
