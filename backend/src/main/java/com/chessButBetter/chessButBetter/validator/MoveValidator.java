package com.chessButBetter.chessButBetter.validator;

import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.BoardDto;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.Move;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.validator.moveTypes.BishopMoveValidator;
import com.chessButBetter.chessButBetter.validator.moveTypes.KingMoveValidator;
import com.chessButBetter.chessButBetter.validator.moveTypes.KnightMoveValidator;
import com.chessButBetter.chessButBetter.validator.moveTypes.PawnMoveValidator;
import com.chessButBetter.chessButBetter.validator.moveTypes.QueenMoveValidator;
import com.chessButBetter.chessButBetter.validator.moveTypes.RookMoveValidator;

import java.util.List;

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
        if (!isValidMoveForPiece(board, game.getMoves(), pieceToMove, move)) {
            logger.warn("Invalid move for piece: " + pieceToMove + " at move: " + move);
            return false; // The move is not valid for the piece type
        }

        if (isKingInCheck(board, move, isWhite(game, user))) {
            logger.warn("Move puts the king in check: " + move);
            return false; // The move puts the player's king in check
        }
        return true;
    }

    private boolean hasCorrectSyntax(String move) {
        // Basic validation: check if the move is in the format "e2e4" or "e7e5"
        if (move.length() != 4 && !isCastlingMove(move)) {
            // check if the move is castling
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

    private boolean isCastlingMove(String move) {
        // Check if the move is castling
        return move.length() == 6 && move.charAt(4) == 'c' && (move.charAt(5) == 's' || move.charAt(5) == 'l');
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

    private boolean isValidMoveForPiece(BoardDto board, List<Move> moves, char pieceToMove, String move) {
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
            if (isCastlingMove(move) && !skipsValidSquares(board, move, isWhite) && !isKingInCheck(board, null, isWhite)) {
                logger.warn("Skipped squares put the king in check: " + move);
                return false; // Castling move is not valid
            }
            return kingMoveValidator.isValidMove(board, moves, move);
        }
        return true;
    }

    private boolean isKingInCheck(BoardDto board, String move, boolean whiteMoved) {
        // Check if the move puts the player's king in check
        BoardDto newBoard = new BoardDto(board.getBoard().clone());
        if (move != null) {
            newBoard.makeMove(move);
        }

        int kingRow = -1;
        int kingCol = -1;
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                char piece = board.getPieceAt((char) ('a' + i), (char) ('1' + j));
                if (piece == 'K' && whiteMoved) {
                    kingRow = i;
                    kingCol = j;
                } else if (piece == 'k' && !whiteMoved) {
                    kingRow = i;
                    kingCol = j;
                }
            }
        }
        if (kingRow == -1 || kingCol == -1) {
            return false; // King not found
        }
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                char piece = board.getPieceAt((char) ('a' + i), (char) ('1' + j));
                if (piece != ' ' && Character.isLowerCase(piece) == whiteMoved) {
                    // Check if the piece can attack the king
                    if (isValidMoveForPiece(board, List.of(), piece, "" + (char) ('a' + i) + (char) ('1' + j)
                            + (char) ('a' + kingRow) + (char) ('1' + kingCol))) {
                        return true; // King is in check
                    }
                }
            }
        }
        return false; // King is not in check
    }

    //Checks if any field skipped puts the king in check
    private boolean skipsValidSquares(BoardDto board, String move, boolean whiteMoved) {
        char startFile = move.charAt(0);
        char startRank = move.charAt(1);
        char endFile = move.charAt(2);

        // Check if the squares between the king and rook are empty
        if (startFile < endFile) {
            for (char file = (char) (startFile + 1); file < endFile; file++) {
                String skippedMove = "" + file + startRank + endFile + startRank;
                if (isKingInCheck(board, skippedMove, whiteMoved)) {
                    return false; // King is in check
                }
            }
        } else {
            for (char file = (char) (endFile + 1); file < startFile; file++) {
                String skippedMove = "" + file + startRank + endFile + startRank;
                if (isKingInCheck(board, skippedMove, whiteMoved)) {
                    return false; // King is in check
                }
            }
        }
        return true;
    }

    // Check if the game is in a checkmate state
    // User is the player who just moved, and we need to check if the other
    // player is in checkmate
    public boolean isCheckmate(Game game, AbstractUser opponent) {
        BoardDto board = new BoardDto(game);

        // Check if the player's king is in check
        if (!isKingInCheck(board, null, isWhite(game, opponent))) {
            return false; // Not in check
        }

        // Check if the player has any valid moves to escape check
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                char piece = board.getPieceAt((char) ('a' + i), (char) ('1' + j));
                if (piece != ' ' && isValidPiece(game, opponent, piece, "" + (char) ('a' + i) + (char) ('1' + j))) {
                    // Check if the piece can make a valid move to escape check
                    for (int k = 0; k < 8; k++) {
                        for (int l = 0; l < 8; l++) {
                            String move = "" + (char) ('a' + i) + (char) ('1' + j) + (char) ('a' + k) + (char) ('1' + l);
                            if (validateMove(game, opponent, move)) {
                                return false; // Valid move found
                            }
                        }
                    }
                }
            }
        }

        return true; // Checkmate
    }
}
