package com.chessButBetter.chessButBetter.dto;

public class MoveDto {
    private String move;
    private Integer moveNumber;

    private Integer timeUsed;
    private Integer player1TimeLeft;
    private Integer player2TimeLeft;

    public MoveDto() {
    }

    public MoveDto(String move, Integer moveNumber) {
        this.move = move;
        this.moveNumber = moveNumber;
        this.timeUsed = null; // Default to null if timeUsed is not provided
    }

    public MoveDto(String move, Integer moveNumber, Integer timeUsed) {
        this.move = move;
        this.moveNumber = moveNumber;
        this.timeUsed = timeUsed;
    }

    public MoveDto(String move, Integer moveNumber, Integer timeUsed, Integer player1TimeLeft, Integer player2TimeLeft) {
        this.move = move;
        this.moveNumber = moveNumber;
        this.timeUsed = timeUsed;
        this.player1TimeLeft = player1TimeLeft;
        this.player2TimeLeft = player2TimeLeft;
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

    public Integer getTimeUsed() {
        return timeUsed;
    }

    public void setTimeUsed(Integer timeUsed) {
        this.timeUsed = timeUsed;
    }

    public Integer getPlayer1TimeLeft() {
        return player1TimeLeft;
    }

    public void setPlayer1TimeLeft(Integer player1TimeLeft) {
        this.player1TimeLeft = player1TimeLeft;
    }

    public Integer getPlayer2TimeLeft() {
        return player2TimeLeft;
    }

    public void setPlayer2TimeLeft(Integer player2TimeLeft) {
        this.player2TimeLeft = player2TimeLeft;
    }
}
