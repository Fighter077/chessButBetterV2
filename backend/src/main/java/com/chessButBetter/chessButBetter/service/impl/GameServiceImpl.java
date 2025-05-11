package com.chessButBetter.chessButBetter.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.Move;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.repositories.GameRepository;
import com.chessButBetter.chessButBetter.service.GameService;
import com.chessButBetter.chessButBetter.validator.MoveValidator;
import com.chessButBetter.chessButBetter.webSocket.send.GameSender;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GameServiceImpl implements GameService {

    private static final Logger logger = LoggerFactory.getLogger(GameServiceImpl.class);

    private final GameRepository gameRepository;
    private final GameSender gameSender;
    private final MoveValidator moveValidator;

    public GameServiceImpl(GameRepository gameRepository, GameSender gameSender, MoveValidator moveValidator) {
        this.gameRepository = gameRepository;
        this.gameSender = gameSender;
        this.moveValidator = moveValidator;
    }

    @Override
    public Optional<Game> getActiveGame(AbstractUser user) {
        return gameRepository.findOpenGameByUserId(user.getId().getUserId());
    }

    @Override
    public Game createGame(AbstractUser player1, AbstractUser player2) {
        if (player1 == null || player2 == null) {
            throw new IllegalArgumentException("Both players must be set.");
        }
        if (player1.getId() == player2.getId()) {
            throw new IllegalArgumentException("Players must be different.");
        }
        if (getActiveGame(player1).isPresent()) {
            throw new IllegalArgumentException("Player 1 already has an active game.");
        }
        if (getActiveGame(player2).isPresent()) {
            throw new IllegalArgumentException("Player 2 already has an active game.");
        }
        // Create a new game instance and save it to the repository
        Game game = new Game(player1, player2, List.of(), null);
        return gameRepository.save(game);
    }

    @Override
    public Game getGameById(Long gameId) {
        return gameRepository.findById(gameId).orElse(null);
    }

    @Transactional
    @Override
    public void move(AbstractUser user, Game game, String move) {
        if (game == null) {
            logger.warn("Game is null. Cannot process move.");
            return;
        }
        try {
            if (user == null) {
                throw new IllegalArgumentException("User must be set.");
            }
            if (!game.getPlayer1Id().equals(user.getId().getUserId()) && !game.getPlayer2Id().equals(user.getId().getUserId())) {
                throw new IllegalArgumentException("User is not a player in this game.");
            }
            logger.info("User {} is making a move: {}", user.getId(), move);
            Game gameWithMoves = gameRepository.findByIdWithMoves(game.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Game not found"));

            // Validate the move
            if (!moveValidator.validateMove(gameWithMoves, user, move)) {
                logger.warn("Invalid move: {} by user: {}", move, user.getId());
                throw new IllegalArgumentException("Invalid move: " + move);
            }

            // Add the move to the game and save it to the repository
            Move moveEntity = new Move(game, move);
            // zero-based index for move number
            moveEntity.setMoveNumber(gameWithMoves.getMoves().size());
            gameWithMoves.addMove(moveEntity);
            gameRepository.save(game);
            // Send the move to the game sender
            gameSender.sendGameMove(game, moveEntity);
        } catch (IllegalArgumentException e) {
            logger.warn("Error while processing move: {}", e.getMessage());
            Game gameWithMoves = gameRepository.findByIdWithMoves(game.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Game not found"));
            Move moveEntity = new Move(gameWithMoves, move);
            moveEntity.setMoveNumber(gameWithMoves.getMoves().size());
            gameSender.sendMoveError(game, moveEntity);
        }
    }
}
