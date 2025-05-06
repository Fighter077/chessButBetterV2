package com.chessButBetter.chessButBetter.validator.moveTypes;

import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.BoardDto;

@Component
public class RookMoveValidator {
    public boolean isValidMove(BoardDto board, String move) {
        char startFile = move.charAt(0);
        char startRank = move.charAt(1);
        char endFile = move.charAt(2);
        char endRank = move.charAt(3);

        // Check if the rook is moving in a straight line (either horizontally or vertically)
        if (startFile == endFile) {
            // Moving vertically
            for (char rank = (char) (Math.min(startRank, endRank) + 1); rank < (char) Math.max(startRank, endRank); rank++) {
                if (board.getPieceAt(startFile, rank) != ' ') {
                    return false; // Path is blocked
                }
            }
            return true; // Valid vertical move
        } else if (startRank == endRank) {
            // Moving horizontally
            for (char file = (char) (Math.min(startFile, endFile) + 1); file < (char) Math.max(startFile, endFile); file++) {
                if (board.getPieceAt(file, startRank) != ' ') {
                    return false; // Path is blocked
                }
            }
            return true; // Valid horizontal move
        }

        return false;
    }
}
