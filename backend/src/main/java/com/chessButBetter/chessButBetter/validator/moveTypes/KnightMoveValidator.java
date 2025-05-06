package com.chessButBetter.chessButBetter.validator.moveTypes;

import org.springframework.stereotype.Component;

@Component
public class KnightMoveValidator {

    public boolean isValidMove(String move) {
        char startFile = move.charAt(0);
        char startRank = move.charAt(1);
        char endFile = move.charAt(2);
        char endRank = move.charAt(3);

        // Check if the move is an L-shape (2 squares in one direction and 1 square in the other)
        int fileDiff = Math.abs(endFile - startFile);
        int rankDiff = Math.abs(endRank - startRank);

        return (fileDiff == 2 && rankDiff == 1) || (fileDiff == 1 && rankDiff == 2);
    }
}
