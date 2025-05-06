package com.chessButBetter.chessButBetter.dto;

public class MoveDto {
    private String move;
    private Integer moveNumber;

    public MoveDto() {
    }

    public MoveDto(String move, Integer moveNumber) {
        this.move = move;
        this.moveNumber = moveNumber;
    }

    public String getMove() {
        return move;
    }

    public void setMove(String move) {
        this.move = move;
    }

    public Integer getMoveNumber() {
        return moveNumber;
    }

    public void setMoveNumber(Integer moveNumber) {
        this.moveNumber = moveNumber;
    }
}
