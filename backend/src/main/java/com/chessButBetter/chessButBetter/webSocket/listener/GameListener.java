package com.chessButBetter.chessButBetter.webSocket.listener;

import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.service.GameService;
import com.chessButBetter.chessButBetter.webSocket.send.GameSender;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class GameListener {

    private static final Logger logger = LoggerFactory.getLogger(GameListener.class);

    private final GameService gameService;
    private final GameSender gameSender;

    public GameListener(GameService gameService, GameSender gameSender) {
        this.gameService = gameService;
        this.gameSender = gameSender;
    }

    public void playerConnected(AbstractUser user, Long gameId) {
        Game game = gameService.getGameById(gameId);
        if (game != null) {
            gameSender.sendPlayerJoined(game, user);
        } else {
            logger.warn("Game with ID " + gameId + " not found for player: " + user.getUsername());
        }
    }

    public void playerDisconnected(AbstractUser user, Long gameId) {
        Game game = gameService.getGameById(gameId);
        if (game != null) {
            gameSender.sendPlayerLeft(game, user);
        } else {
            logger.warn("Game with ID " + gameId + " not found for player: " + user.getUsername());
        }
    }

    public void playerMoved(AbstractUser user, Long gameId, String move) {
        Game game = gameService.getGameById(gameId);
        if (game != null) {
            gameService.move(user, game, move);
        } else {
            logger.warn("Game not found for player: " + user.getUsername() + " with move: " + move);
        }
    }
}