package com.chessButBetter.chessButBetter.dto;

public class PlayerJoinedDto {
    PlayerDto player;
    GameStateDto gameState;

    public PlayerJoinedDto() {
    }

    public PlayerJoinedDto(PlayerDto player, GameStateDto gameState) {
        this.player = player;
        this.gameState = gameState;
    }

    public PlayerDto getPlayer() {
        return player;
    }

    public void setPlayer(PlayerDto player) {
        this.player = player;
    }

    public GameStateDto getGameState() {
        return gameState;
    }

    public void setGameState(GameStateDto gameState) {
        this.gameState = gameState;
    }
}
