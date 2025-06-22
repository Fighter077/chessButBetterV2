package com.chessButBetter.chessButBetter.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.chessButBetter.chessButBetter.dto.GameDto;
import com.chessButBetter.chessButBetter.dto.GameEndReasonDto;
import com.chessButBetter.chessButBetter.entity.DrawOffer;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.Move;
import com.chessButBetter.chessButBetter.entity.TempUser;
import com.chessButBetter.chessButBetter.entity.UserId;
import com.chessButBetter.chessButBetter.enums.DrawAction;
import com.chessButBetter.chessButBetter.enums.RoleType;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.mapper.DrawOfferMapper;
import com.chessButBetter.chessButBetter.mapper.MoveMapper;
import com.chessButBetter.chessButBetter.mapper.PlayerMapper;
import com.chessButBetter.chessButBetter.repositories.DrawOfferRepository;
import com.chessButBetter.chessButBetter.repositories.GameRepository;
import com.chessButBetter.chessButBetter.service.AbstractUserService;
import com.chessButBetter.chessButBetter.service.ChessService;
import com.chessButBetter.chessButBetter.service.GameService;
import com.chessButBetter.chessButBetter.validator.MoveValidator;
import com.chessButBetter.chessButBetter.webSocket.send.GameSender;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GameServiceImpl implements GameService {

    @Value("${game.only-allowed-to-play-once}")
    private boolean ONLY_ALLOWED_TO_PLAY_ONCE;

    private static final Logger logger = LoggerFactory.getLogger(GameServiceImpl.class);

    private final GameRepository gameRepository;
    private final GameSender gameSender;
    private final MoveValidator moveValidator;
    private final ChessService chessService;
    private final DrawOfferRepository drawOfferRepository;
    private final AbstractUserService userService;

    public GameServiceImpl(GameRepository gameRepository, GameSender gameSender, MoveValidator moveValidator,
            ChessService chessService, DrawOfferRepository drawOfferRepository, AbstractUserService userService) {
        this.gameRepository = gameRepository;
        this.gameSender = gameSender;
        this.moveValidator = moveValidator;
        this.chessService = chessService;
        this.drawOfferRepository = drawOfferRepository;
        this.userService = userService;
    }

    @Override
    public List<Game> getActiveGame(AbstractUser user) {
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
        if ((getActiveGame(player1).size() > 0 && ONLY_ALLOWED_TO_PLAY_ONCE)
                && !player1.getRole().equals(RoleType.ADMIN)) {
            throw new IllegalArgumentException("Player 1 already has an active game.");
        }
        if ((getActiveGame(player2).size() > 0 && ONLY_ALLOWED_TO_PLAY_ONCE)
                && !player2.getRole().equals(RoleType.ADMIN)) {
            throw new IllegalArgumentException("Player 2 already has an active game.");
        }
        // randomly assign colors
        if (Math.random() < 0.5) {
            AbstractUser temp = player1;
            player1 = player2;
            player2 = temp;
        }
        // Create a new game instance and save it to the repository
        Game game = new Game(player1, player2, List.of(), null);
        return gameRepository.save(game);
    }

    @Override
    public Optional<Game> getGameById(Long gameId) {
        return gameRepository.findById(gameId);
    }

    @Override
    public GameDto getGameState(Long gameId) {
        Game game = gameRepository.findByIdWithMoves(gameId)
                .orElseThrow(() -> new EntityNotFoundException("Game not found"));
        GameDto gameStateDto = new GameDto();
        gameStateDto.setId(game.getId());
        AbstractUser player1 = userService.getUserById(game.getPlayer1Id()).orElseThrow(
                () -> new EntityNotFoundException("Player 1 not found"));
        AbstractUser player2 = userService.getUserById(game.getPlayer2Id()).orElseThrow(
                () -> new EntityNotFoundException("Player 2 not found"));
        gameStateDto.setPlayer1(PlayerMapper.fromEntity(player1));
        gameStateDto.setPlayer2(PlayerMapper.fromEntity(player2));
        gameStateDto.setResult(game.getResult());

        gameStateDto.setMoves(MoveMapper.fromEntity(game));
        DrawOffer drawOffer = drawOfferRepository
                .findOpenDrawOfferByGameIdAndPlayerId(game.getId(), player1.getId().getUserId())
                .orElse(drawOfferRepository
                        .findOpenDrawOfferByGameIdAndPlayerId(game.getId(), player2.getId().getUserId()).orElse(null));
        if (drawOffer != null) {
            gameStateDto.setDrawOffer(DrawOfferMapper.fromEntity(drawOffer));
        }
        return gameStateDto;
    }

    @Override
    public Game endGame(Game game, String result) {
        if (game == null) {
            logger.warn("Game is null. Cannot end game.");
            return null;
        }
        if (result == null || result.isEmpty()) {
            throw new IllegalArgumentException("Result must be set.");
        }
        // Set the game result and save it to the repository
        game.setResult(result);
        return gameRepository.save(game);
    }

    // Validates the move and updates the game state, including sending the move to
    // the game sender
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
            boolean isPlayer1;
            if (game.getPlayer1Id().equals(user.getId().getUserId())) {
                isPlayer1 = true;
            } else if (game.getPlayer2Id().equals(user.getId().getUserId())) {
                isPlayer1 = false;
            } else {
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

            // Create a temporary user for the opponent
            Long userId = user.getId().getUserId();
            Long opponentId = null;
            if (game.getPlayer1Id().equals(userId)) {
                opponentId = game.getPlayer2Id();
            } else if (game.getPlayer2Id().equals(userId)) {
                opponentId = game.getPlayer1Id();
            }
            AbstractUser opponent = new TempUser();
            opponent.setId(new UserId(opponentId));
            // Check if the game is over
            if (moveValidator.isCheckmate(gameWithMoves, opponent)) {
                logger.info("Game over: Checkmate by user: {}", user.getUsername());
                GameEndReasonDto gameOverDto = new GameEndReasonDto();
                gameOverDto.setCheckmate(moveEntity.getMove(), moveEntity.getId().getMoveNumber(),
                        PlayerMapper.fromEntity(user));

                String result = isPlayer1 ? "1-0" : "0-1";
                game.setResult(result);
                gameRepository.save(game);

                gameSender.sendGameOver(game, gameOverDto);
                return;
            }

            gameRepository.save(game);
            // Send the move to the game sender
            gameSender.sendGameMove(gameWithMoves, moveEntity);
        } catch (IllegalArgumentException e) {
            logger.warn("Error while processing move: {}", e.getMessage());
            Game gameWithMoves = gameRepository.findByIdWithMoves(game.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Game not found"));
            Move moveEntity = new Move(gameWithMoves, move);
            moveEntity.setMoveNumber(gameWithMoves.getMoves().size());
            gameSender.sendMoveError(game, moveEntity);
        }
    }

    // Sends a resignation message to the game sender and updates the game result
    @Override
    public void resign(AbstractUser user, Game game) {
        if (game == null) {
            logger.warn("Game is null. Cannot process resignation.");
            return;
        }
        if (user == null) {
            throw new IllegalArgumentException("User must be set.");
        }
        boolean isPlayer1;
        if (game.getPlayer1Id().equals(user.getId().getUserId())) {
            isPlayer1 = true;
        } else if (game.getPlayer2Id().equals(user.getId().getUserId())) {
            isPlayer1 = false;
        } else {
            throw new IllegalArgumentException("User is not a player in this game.");
        }
        String result = isPlayer1 ? "0-1" : "1-0";
        game.setResult(result);
        gameRepository.save(game);

        Long userId = user.getId().getUserId();
        Long opponentId = null;
        if (game.getPlayer1Id().equals(userId)) {
            opponentId = game.getPlayer2Id();
        } else if (game.getPlayer2Id().equals(userId)) {
            opponentId = game.getPlayer1Id();
        }
        AbstractUser opponent = new TempUser();
        opponent.setId(new UserId(opponentId));

        GameEndReasonDto gameOverDto = new GameEndReasonDto();
        gameOverDto.setResignation(PlayerMapper.fromEntity(opponent));
        gameSender.sendGameOver(game, gameOverDto);
    }

    @Override
    public Move getBestMove(Game game) {
        if (game == null) {
            logger.warn("Game is null. Cannot get best move.");
            return null;
        }
        String position = game.getMoves().stream()
                .map(Move::getMove)
                .map(move -> move.substring(0, 4))
                .reduce("", (a, b) -> a + " " + b).trim();
        try {
            String move = chessService.getBestMove(position);
            Move bestMove = new Move(game, move);
            bestMove.setMoveNumber(game.getMoves().size());
            return bestMove;
        } catch (Exception e) {
            logger.error("Error getting best move: {}", e.getMessage());
            throw new RuntimeException("Error getting best move", e);
        }
    }

    @Override
    public void acceptDraw(Game game, AbstractUser user) {
        if (game == null) {
            logger.warn("Game is null. Cannot accept draw.");
            return;
        }
        if (user == null) {
            throw new IllegalArgumentException("User must be set.");
        }
        if (!game.getPlayer1Id().equals(user.getId().getUserId())
                && !game.getPlayer2Id().equals(user.getId().getUserId())) {
            throw new IllegalArgumentException("User is not a player in this game.");
        }
        String result = "1/2";
        game.setResult(result);
        gameRepository.save(game);

        GameEndReasonDto gameOverDto = new GameEndReasonDto();
        gameOverDto.setDrawOffer();
        gameSender.sendGameOver(game, gameOverDto);
    }

    @Override
    public DrawOffer offerDraw(Game game, AbstractUser user) {
        if (game == null) {
            logger.warn("Game is null. Cannot offer draw.");
            return null;
        }
        if (user == null) {
            throw new IllegalArgumentException("User must be set.");
        }
        Long opponentId = null;
        if (game.getPlayer1Id().equals(user.getId().getUserId())) {
            opponentId = game.getPlayer2Id();
        } else if (game.getPlayer2Id().equals(user.getId().getUserId())) {
            opponentId = game.getPlayer1Id();
        } else {
            throw new IllegalArgumentException("User is not a player in this game.");
        }
        if (this.drawOfferRepository.existsOpenDrawOfferByGameIdAndPlayerId(game.getId(), user.getId().getUserId())) {
            throw new IllegalArgumentException("Draw offer already exists.");
        }
        if (this.drawOfferRepository.findOpenDrawOfferByGameIdAndPlayerId(game.getId(), opponentId).isPresent()) {
            acceptDraw(game, user);
            return null;
        }
        DrawOffer drawOffer = new DrawOffer(game, user.getId().getUserId(), DrawAction.OFFERED);
        drawOfferRepository.save(drawOffer);
        gameSender.sendDrawOffer(game, drawOffer);
        return drawOffer;
    }

    @Override
    public Optional<DrawOffer> getDrawOffer(Long gameId) {
        return drawOfferRepository.findOpenDrawOfferByGameId(gameId);
    }

    @Override
    public void cancelDraw(Game game, AbstractUser user) {
        if (game == null) {
            logger.warn("Game is null. Cannot cancel draw.");
            return;
        }
        if (user == null) {
            throw new IllegalArgumentException("User must be set.");
        }
        if (!game.getPlayer1Id().equals(user.getId().getUserId())
                && !game.getPlayer2Id().equals(user.getId().getUserId())) {
            throw new IllegalArgumentException("User is not a player in this game.");
        }
        if (this.drawOfferRepository
                .findOpenDrawOfferByGameIdAndPlayerId(game.getId(), game.getPlayer1Id())
                .isEmpty()
                && this.drawOfferRepository.findOpenDrawOfferByGameIdAndPlayerId(game.getId(), game.getPlayer2Id())
                        .isEmpty()) {
            throw new IllegalArgumentException("Draw offer does not exist.");
        }
        DrawOffer drawOffer = new DrawOffer(game, user.getId().getUserId(), DrawAction.REJECTED);
        drawOfferRepository.save(drawOffer);
        gameSender.sendDrawOffer(game, drawOffer);
    }
}
