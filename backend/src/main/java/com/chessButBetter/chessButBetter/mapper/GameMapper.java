package com.chessButBetter.chessButBetter.mapper;

import com.chessButBetter.chessButBetter.dto.GameDto;
import com.chessButBetter.chessButBetter.entity.Game;

public class GameMapper {
    public static GameDto fromEntity(Game game) {
        return new GameDto(game.getId(), PlayerMapper.fromEntity(game.getPlayer1()),
                PlayerMapper.fromEntity(game.getPlayer2()), game.getResult(),
                game.getMoves().stream().map(move -> move.getMove()).toList());
    }
}
