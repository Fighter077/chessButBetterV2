package com.chessButBetter.chessButBetter.webSocket.listener;

import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.GameDto;
import com.chessButBetter.chessButBetter.dto.PlayerJoinedDto;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.mapper.PlayerMapper;
import com.chessButBetter.chessButBetter.service.GameService;
import com.chessButBetter.chessButBetter.webSocket.send.GameSender;

import java.util.Optional;

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
        Optional<Game> game = gameService.getGameById(gameId);
        if (game.isPresent()) {
            GameDto gameDto = gameService.getGameState(game.get().getId());
            PlayerJoinedDto playerJoinedDto = new PlayerJoinedDto(PlayerMapper.fromEntity(user), gameDto);
            gameSender.sendPlayerJoined(game.get(), playerJoinedDto);
        } else {
            logger.warn("Game with ID " + gameId + " not found for player: " + user.getUsername());
        }
    }

    public void playerDisconnected(AbstractUser user, Long gameId) {
        Optional<Game> game = gameService.getGameById(gameId);
        if (game.isPresent()) {
            gameSender.sendPlayerLeft(game.get(), user);
        } else {
            logger.warn("Game with ID " + gameId + " not found for player: " + user.getUsername());
        }
    }

    public void playerMoved(AbstractUser user, Long gameId, String move) {
        Optional<Game> game = gameService.getGameById(gameId);
        if (game.isPresent()) {
            gameService.move(user, game.get(), move);
        } else {
            logger.warn("Game not found for player: " + user.getUsername() + " with move: " + move);
        }
    }

    public void playerResigned(AbstractUser user, Long gameId) {
        Optional<Game> game = gameService.getGameById(gameId);
        if (game.isPresent()) {
            gameService.resign(user, game.get());
        } else {
            logger.warn("Game not found for player: " + user.getUsername());
        }
    }

    public void playerOfferedDraw(AbstractUser user, Long gameId) {
        Optional<Game> game = gameService.getGameById(gameId);
        if (game.isPresent()) {
            gameService.offerDraw(game.get(), user);
        } else {
            logger.warn("Game not found for player: " + user.getUsername());
        }
    }

    public void playerCanceledDraw(AbstractUser user, Long gameId) {
        Optional<Game> game = gameService.getGameById(gameId);
        if (game.isPresent()) {
            gameService.cancelDraw(game.get(), user);
        } else {
            logger.warn("Game not found for player: " + user.getUsername());
        }
    }

    public void checkTimeout(Long gameId) {
        Optional<Game> game = gameService.getGameById(gameId);
        if (game.isPresent()) {
            gameService.checkTimeout(game.get());
        } else {
            logger.warn("Game not found for timeout check: " + gameId);
        }
    }
}