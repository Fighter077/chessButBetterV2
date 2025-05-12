package com.chessButBetter.chessButBetter.mapper;

import com.chessButBetter.chessButBetter.dto.GameDto;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

public class GameMapper {
    public static GameDto fromEntity(Game game, AbstractUser player1, AbstractUser player2) {
        return new GameDto(game.getId(), PlayerMapper.fromEntity(player1),
                PlayerMapper.fromEntity(player2), game.getResult(),
                game.getMoves().stream().map(move -> move.getMove()).toList());
    }
}
