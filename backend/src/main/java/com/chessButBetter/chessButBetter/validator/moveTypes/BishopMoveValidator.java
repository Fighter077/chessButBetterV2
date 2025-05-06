package com.chessButBetter.chessButBetter.validator.moveTypes;

import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.BoardDto;

@Component
public class BishopMoveValidator {

    public boolean isValidMove(BoardDto board, String move) {
        char startFile = move.charAt(0);
        char startRank = move.charAt(1);
        char endFile = move.charAt(2);
        char endRank = move.charAt(3);

        // Check if the move is diagonal
        if (Math.abs(endFile - startFile) == Math.abs(endRank - startRank)) {
            // Check if the path is clear
            int fileDirection = (endFile - startFile) > 0 ? 1 : -1;
            int rankDirection = (endRank - startRank) > 0 ? 1 : -1;

            for (int i = 1; i < Math.abs(endFile - startFile); i++) {
                char intermediateFile = (char) (startFile + i * fileDirection);
                char intermediateRank = (char) (startRank + i * rankDirection);
                if (board.getPieceAt(intermediateFile, intermediateRank) != ' ') {
                    return false; // Path is blocked
                }
            }

            return true; // Valid bishop move
        }
        return false; // Not a valid bishop move
    }
}
