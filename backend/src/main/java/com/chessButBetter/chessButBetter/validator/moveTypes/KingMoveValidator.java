package com.chessButBetter.chessButBetter.validator.moveTypes;

import org.springframework.stereotype.Component;

@Component
public class KingMoveValidator {
    
    public boolean isValidMove(String move) {
        char startFile = move.charAt(0);
        char startRank = move.charAt(1);
        char endFile = move.charAt(2);
        char endRank = move.charAt(3);

        // Check if the move is one square in any direction
        int fileDiff = Math.abs(endFile - startFile);
        int rankDiff = Math.abs(endRank - startRank);

        return (fileDiff <= 1 && rankDiff <= 1) && !(fileDiff == 0 && rankDiff == 0);
    }
}
