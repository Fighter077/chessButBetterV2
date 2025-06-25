package com.chessButBetter.chessButBetter.dto;

import java.time.LocalDateTime;
import java.util.List;

public class DemoGameDto {
    private Long id;
    private PlayerDto player1;
    private PlayerDto player2;
    private String result;
    private List<MoveDto> moves;
    private LocalDateTime startTime;
    
    private String demoInfo = "This is a demo game, not a real game.";

    public DemoGameDto() {
    }

    public DemoGameDto(Long id, PlayerDto player1, PlayerDto player2, String result, List<MoveDto> moves, LocalDateTime startTime, String demoInfo) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.result = result;
        this.moves = moves;
        this.startTime = startTime;
        this.demoInfo = demoInfo;
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

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public String getDemoInfo() {
        return demoInfo;
    }

    public void setDemoInfo(String demoInfo) {
        this.demoInfo = demoInfo;
    }
}
