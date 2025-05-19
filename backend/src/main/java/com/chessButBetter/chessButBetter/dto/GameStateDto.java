package com.chessButBetter.chessButBetter.dto;

import java.util.List;

public class GameStateDto {
    private Long id;
    private PlayerDto player1;
    private PlayerDto player2;
    private String result;
    private DrawOfferDto drawOffer;
    private List<String> moves;

    public GameStateDto() {
    }

    public GameStateDto(Long id, PlayerDto player1, PlayerDto player2, String result, DrawOfferDto drawOffer, List<String> moves) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.result = result;
        this.drawOffer = drawOffer;
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

    public DrawOfferDto getDrawOffer() {
        return drawOffer;
    }

    public void setDrawOffer(DrawOfferDto drawOffer) {
        this.drawOffer = drawOffer;
    }

    public List<String> getMoves() {
        return moves;
    }

    public void setMoves(List<String> moves) {
        this.moves = moves;
    }
}
