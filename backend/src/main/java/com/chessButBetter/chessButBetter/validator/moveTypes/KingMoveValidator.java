package com.chessButBetter.chessButBetter.validator.moveTypes;

import java.util.List;

import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.BoardDto;
import com.chessButBetter.chessButBetter.entity.Move;

@Component
public class KingMoveValidator {
    
    public boolean isValidMove(BoardDto board, List<Move> moves, String move) {
        char startFile = move.charAt(0);
        char startRank = move.charAt(1);
        char endFile = move.charAt(2);
        char endRank = move.charAt(3);

        // Check if the move is one square in any direction
        int fileDiff = Math.abs(endFile - startFile);
        int rankDiff = Math.abs(endRank - startRank);

        if (move.length() == 4) {
            return (fileDiff <= 1 && rankDiff <= 1) && !(fileDiff == 0 && rankDiff == 0);
        }
        
        // Move is castling
        if (!isValidCastlingMove(move)) {
            return false;
        }
        // Check if the king has moved before
        if (pieceHasMoved(moves, move)) {
            return false;
        }
        // Check if the rook has moved before
        char rookFile = move.charAt(4);
        char rookRank = move.charAt(5);
        if (pieceHasMoved(moves, String.valueOf(rookFile) + rookRank)) {
            return false;
        }

        // Check if the squares between the king and rook are empty
        if (castleBlocked(board, move)) {
            return false;
        }
        return true;
    }

    private boolean castleBlocked(BoardDto board, String move) {
        // Check if the squares between the king and rook are empty
        char startFile = move.charAt(0);
        char startRank = move.charAt(1);
        char endFile = move.charAt(2);

        // Check the squares between the king and rook
        if (startFile < endFile) {
            for (char file = (char) (startFile + 1); file < endFile; file++) {
                if (board.getPieceAt(file, startRank) != ' ') {
                    return true;
                }
            }
        } else {
            for (char file = (char) (endFile + 1); file < startFile; file++) {
                if (board.getPieceAt(file, startRank) != ' ') {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean pieceHasMoved(List<Move> moves, String move) {
        // Check if the king has moved before
        char endFile = move.charAt(0);
        char endRank = move.charAt(1);
        
        for (Move m : moves) {
            if (m.getMove().charAt(2) == endFile && m.getMove().charAt(3) == endRank) {
                return true;
            }
        }
        return false;
    }

    public boolean isValidCastlingMove(String move) {
        // Castling move should be in the format "e1g1cs" or "e8g8cl" for castle short or long
        if (move.length() != 6) {
            return false;
        }

        char castleChar = move.charAt(4);
        char castleDirection = move.charAt(5);

        return (castleChar == 'c' && (castleDirection == 'l' || castleDirection == 's'));
    }

    
}
