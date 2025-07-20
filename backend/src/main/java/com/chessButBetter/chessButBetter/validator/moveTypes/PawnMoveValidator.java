package com.chessButBetter.chessButBetter.validator.moveTypes;

import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.BoardDto;

@Component
public class PawnMoveValidator {
    public boolean isValidMove(BoardDto board, String move, boolean isWhite, String enPassantField) {
        char startFile = move.charAt(0);
        char startRank = move.charAt(1);
        char endFile = move.charAt(2);
        char endRank = move.charAt(3);

        // Check if the move is valid for a pawn
        if (isWhite) {
            if (startRank == '2' && endRank == '4' && startFile == endFile) {
                return board.getPieceAt(endFile, endRank) == ' '; // Two squares forward from starting position
            } else if (endRank == startRank + 1 && startFile == endFile) {
                return board.getPieceAt(endFile, endRank) == ' '; // One square forward
            } else if (endRank == startRank + 1 && Math.abs(endFile - startFile) == 1) {
                // Check if the destination square is occupied by a piece
                return board.getPieceAt(endFile, endRank) != ' ' || enPassantField.equals(endFile + "" + endRank); // Diagonal capture
            }
        } else {
            if (startRank == '7' && endRank == '5' && startFile == endFile) {
                return board.getPieceAt(endFile, endRank) == ' '; // Two squares forward from starting position
            } else if (endRank == startRank - 1 && startFile == endFile) {
                return board.getPieceAt(endFile, endRank) == ' '; // One square forward
            } else if (endRank == startRank - 1 && Math.abs(endFile - startFile) == 1) {
                return board.getPieceAt(endFile, endRank) != ' ' || enPassantField.equals(endFile + "" + endRank); // Diagonal capture
            }
        }

        return false;
    }
}
