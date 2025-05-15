package com.chessButBetter.chessButBetter.dto;

import com.chessButBetter.chessButBetter.enums.GameEndReason;

public class GameEndReasonDto {

    private String move = null;
    private Integer moveNumber = null;
    
    private GameEndReason reason = null;
    
    private PlayerDto winner = null;

    public GameEndReasonDto() {
    }

    public void setCheckmate(String move, Integer moveNumber, PlayerDto winner) {
        this.move = move;
        this.moveNumber = moveNumber;
        this.reason = GameEndReason.CHECKMATE;
        this.winner = winner;
    }

    public void setStalemate(String move, Integer moveNumber) {
        this.move = move;
        this.moveNumber = moveNumber;
        this.reason = GameEndReason.STALEMATE;
    }

    public void setInsufficientMaterial(String move, Integer moveNumber) {
        this.move = move;
        this.moveNumber = moveNumber;
        this.reason = GameEndReason.INSUFFICIENT_MATERIAL;
    }

    public void setThreefoldRepetition(String move, Integer moveNumber) {
        this.move = move;
        this.moveNumber = moveNumber;
        this.reason = GameEndReason.THREEFOLD_REPETITION;
    }

    public void setFiftyMoveRule(String move, Integer moveNumber) {
        this.move = move;
        this.moveNumber = moveNumber;
        this.reason = GameEndReason.FIFTY_MOVE_RULE;
    }

    public void setTimeOut(PlayerDto winner) {
        this.winner = winner;
        this.reason = GameEndReason.TIME_OUT;
    }

    public void setResignation(PlayerDto winner) {
        this.winner = winner;
        this.reason = GameEndReason.RESIGNATION;
    }

    public void setDrawOffer() {
        this.reason = GameEndReason.DRAW_OFFER;
    }

    public void setGameAbandoned(PlayerDto winner) {
        this.winner = winner;
        this.reason = GameEndReason.GAME_ABANDONED;
    }

    public String getMove() {
        return move;
    }

    public Integer getMoveNumber() {
        return moveNumber;
    }

    public GameEndReason getReason() {
        return reason;
    }

    public PlayerDto getWinner() {
        return winner;
    }
    
}
