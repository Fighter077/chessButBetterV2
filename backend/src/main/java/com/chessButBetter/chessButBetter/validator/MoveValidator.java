package com.chessButBetter.chessButBetter.validator;

import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.BoardDto;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.validator.moveTypes.BishopMoveValidator;
import com.chessButBetter.chessButBetter.validator.moveTypes.KingMoveValidator;
import com.chessButBetter.chessButBetter.validator.moveTypes.KnightMoveValidator;
import com.chessButBetter.chessButBetter.validator.moveTypes.PawnMoveValidator;
import com.chessButBetter.chessButBetter.validator.moveTypes.QueenMoveValidator;
import com.chessButBetter.chessButBetter.validator.moveTypes.RookMoveValidator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class MoveValidator {

    private static final Logger logger = LoggerFactory.getLogger(MoveValidator.class);
    private final PawnMoveValidator pawnMoveValidator;
    private final RookMoveValidator rookMoveValidator;
    private final BishopMoveValidator bishopMoveValidator;
    private final KnightMoveValidator knightMoveValidator;
    private final QueenMoveValidator queenMoveValidator;
    private final KingMoveValidator kingMoveValidator;

    public MoveValidator(
            PawnMoveValidator pawnMoveValidator,
            RookMoveValidator rookMoveValidator,
            BishopMoveValidator bishopMoveValidator,
            KnightMoveValidator knightMoveValidator,
            QueenMoveValidator queenMoveValidator,
            KingMoveValidator kingMoveValidator) {
        this.pawnMoveValidator = pawnMoveValidator;
        this.rookMoveValidator = rookMoveValidator;
        this.bishopMoveValidator = bishopMoveValidator;
        this.knightMoveValidator = knightMoveValidator;
        this.queenMoveValidator = queenMoveValidator;
        this.kingMoveValidator = kingMoveValidator;
    }

    public boolean validateMove(Game game, AbstractUser user, String move) {
        // Check if the move is in the correct format (e.g., "e2e4")
        if (!hasCorrectSyntax(move)) {
            logger.warn("Invalid move syntax: " + move);
            return false;
        }

        // Check if the game is in a valid state for the move (e.g., not over, correct
        // player's turn)
        if (game.getResult() != null) {
            logger.warn("Game is over, no more moves allowed: " + game.getResult());
            return false; // Game is over, no more moves allowed
        }

        if (!playerCanMove(game, user.getId().getUserId())) {
            logger.warn("It's not the player's turn: " + user.getUsername());
            return false; // It's not the player's turn
        }

        BoardDto board = new BoardDto(game);
        char pieceToMove = board.getPieceAt(move.charAt(0), move.charAt(1));
        if (!isValidPiece(game, user, pieceToMove, move)) {
            logger.warn("Invalid piece to move: " + pieceToMove + " for player: " + user.getUsername());
            return false; // The piece does not belong to the player
        }

        char destinationPiece = board.getPieceAt(move.charAt(2), move.charAt(3));
        if (!movesToValidSquare(board, move, pieceToMove, destinationPiece)) {
            logger.warn("Invalid destination square for move: " + move);
            return false; // The destination square is not valid for the move
        }

        // Check if the move is valid for the piece type (e.g., pawn, knight, etc.)
        if (!isValidMoveForPiece(board, pieceToMove, move)) {
            logger.warn("Invalid move for piece: " + pieceToMove + " at move: " + move);
            return false; // The move is not valid for the piece type
        }

        return true;
    }

    private boolean hasCorrectSyntax(String move) {
        // Basic validation: check if the move is in the format "e2e4" or "e7e5"
        if (move.length() != 4) {
            return false;
        }

        char startFile = move.charAt(0);
        char startRank = move.charAt(1);
        char endFile = move.charAt(2);
        char endRank = move.charAt(3);

        // Check if the files are between 'a' and 'h'
        if (startFile < 'a' || startFile > 'h' || endFile < 'a' || endFile > 'h') {
            return false;
        }

        // Check if the ranks are between '1' and '8'
        if (startRank < '1' || startRank > '8' || endRank < '1' || endRank > '8') {
            return false;
        }

        return true;
    }

    private boolean playerCanMove(Game game, Long userId) {
        Long currentPlayerId = game.getPlayer1Id();
        if (game.getMoves().size() % 2 == 1) {
            currentPlayerId = game.getPlayer2Id();
        }
        return currentPlayerId.equals(userId);
    }

    private boolean isWhite(Game game, AbstractUser user) {
        return game.getPlayer1Id().equals(user.getId().getUserId());
    }

    private boolean isValidPiece(Game game, AbstractUser user, char pieceToMove, String move) {
        if (pieceToMove == ' ') {
            return false;
        }

        // Check if the piece belongs to the player making the move
        if (isWhite(game, user)) {
            return Character.isUpperCase(pieceToMove); // White pieces are uppercase
        } else {
            return Character.isLowerCase(pieceToMove); // Black pieces are lowercase
        }
    }

    private boolean movesToValidSquare(BoardDto board, String move, char pieceToMove, char destinationPiece) {
        // Check if the destination square is empty or occupied by an opponent's piece
        if (destinationPiece == ' ') {
            return true; // Empty square
        } else {
            return Character.isLowerCase(destinationPiece) != Character.isLowerCase(pieceToMove); // Opponent's piece
        }
    }

    private boolean isValidMoveForPiece(BoardDto board, char pieceToMove, String move) {
        boolean isWhite = Character.isUpperCase(pieceToMove);
        if (Character.toLowerCase(pieceToMove) == 'p') {
            // Validate pawn move
            return pawnMoveValidator.isValidMove(board, move, isWhite);
        }
        if (Character.toLowerCase(pieceToMove) == 'r') {
            // Validate rook move
            return rookMoveValidator.isValidMove(board, move);
        }
        if (Character.toLowerCase(pieceToMove) == 'b') {
            // Validate bishop move
            return bishopMoveValidator.isValidMove(board, move);
        }
        if (Character.toLowerCase(pieceToMove) == 'n') {
            // Validate knight move
            return knightMoveValidator.isValidMove(move);
        }
        if (Character.toLowerCase(pieceToMove) == 'q') {
            // Validate queen move
            return queenMoveValidator.isValidMove(board, move);
        }
        if (Character.toLowerCase(pieceToMove) == 'k') {
            // Validate king move
            return kingMoveValidator.isValidMove(move);
        }
        return true;
    }
}
