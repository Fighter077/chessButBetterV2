package com.chessButBetter.chessButBetter.dto;

public class PlayerJoinedDto {
    PlayerDto player;
    GameDto gameState;

    public PlayerJoinedDto() {
    }

    public PlayerJoinedDto(PlayerDto player, GameDto gameState) {
        this.player = player;
        this.gameState = gameState;
    }

    public PlayerDto getPlayer() {
        return player;
    }

    public void setPlayer(PlayerDto player) {
        this.player = player;
    }

    public GameDto getGameState() {
        return gameState;
    }

    public void setGameState(GameDto gameState) {
        this.gameState = gameState;
    }
}
