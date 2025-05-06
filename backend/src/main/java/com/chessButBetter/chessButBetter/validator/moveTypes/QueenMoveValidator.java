package com.chessButBetter.chessButBetter.validator.moveTypes;

import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.BoardDto;

@Component
public class QueenMoveValidator {
    
    private final BishopMoveValidator bishopMoveValidator;
    private final RookMoveValidator rookMoveValidator;

    public QueenMoveValidator(BishopMoveValidator bishopMoveValidator, RookMoveValidator rookMoveValidator) {
        this.bishopMoveValidator = bishopMoveValidator;
        this.rookMoveValidator = rookMoveValidator;
    }

    public boolean isValidMove(BoardDto board, String move) {
        // Check if the move is valid for a rook or a bishop
        return rookMoveValidator.isValidMove(board, move) || bishopMoveValidator.isValidMove(board, move);
    }
}
