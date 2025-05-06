package com.chessButBetter.chessButBetter.dto;

public class MoveErrorDto {
    private Integer moveNumber;

    public MoveErrorDto() {
    }

    public MoveErrorDto(Integer moveNumber) {
        this.moveNumber = moveNumber;
    }

    public Integer getMoveNumber() {
        return moveNumber;
    }

    public void setMoveNumber(Integer moveNumber) {
        this.moveNumber = moveNumber;
    }
}
