package com.chessButBetter.chessButBetter.dto;

import java.util.List;

public class GameDto {
    private Long id;
    private PlayerDto player1;
    private PlayerDto player2;
    private String result;
    private List<String> moves;

    public GameDto() {
    }

    public GameDto(Long id, PlayerDto player1, PlayerDto player2, String result, List<String> moves) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.result = result;
        this.moves = moves;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlayerDto getPlayer1() {
        return player1;
    }

    public void setPlayer1(PlayerDto player1) {
        this.player1 = player1;
    }

    public PlayerDto getPlayer2() {
        return player2;
    }

    public void setPlayer2(PlayerDto player2) {
        this.player2 = player2;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public List<String> getMoves() {
        return moves;
    }

    public void setMoves(List<String> moves) {
        this.moves = moves;
    }
}
