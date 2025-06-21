package com.chessButBetter.chessButBetter.dto;

import java.time.LocalDateTime;
import java.util.List;

public class GameDto {
    private Long id;
    private PlayerDto player1;
    private PlayerDto player2;
    private String result;
    private List<MoveDto> moves;
    private DrawOfferDto drawOffer;
    private LocalDateTime startTime;
    private Integer start; // Optional, can be null
    private Integer increment; // Optional, can be null
    
    
    private Integer player1TimeLeft;
    private Integer player2TimeLeft;

    public GameDto() {
    }

    public GameDto(Long id, PlayerDto player1, PlayerDto player2, String result, List<MoveDto> moves, DrawOfferDto drawOffer, LocalDateTime startTime, Integer start, Integer increment, Integer player1TimeLeft, Integer player2TimeLeft) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.result = result;
        this.moves = moves;
        this.drawOffer = drawOffer;
        this.startTime = startTime;
        this.start = start;
        this.increment = increment;
        this.player1TimeLeft = player1TimeLeft;
        this.player2TimeLeft = player2TimeLeft;
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

    public List<MoveDto> getMoves() {
        return moves;
    }

    public void setMoves(List<MoveDto> moves) {
        this.moves = moves;
    }

    public DrawOfferDto getDrawOffer() {
        return drawOffer;
    }

    public void setDrawOffer(DrawOfferDto drawOffer) {
        this.drawOffer = drawOffer;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public Integer getStart() {
        return start;
    }

    public void setStart(Integer start) {
        this.start = start;
    }

    public Integer getIncrement() {
        return increment;
    }

    public void setIncrement(Integer increment) {
        this.increment = increment;
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
