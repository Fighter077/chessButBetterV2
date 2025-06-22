package com.chessButBetter.chessButBetter.mapper;

import java.time.LocalDateTime;

import com.chessButBetter.chessButBetter.dto.GameDto;
import com.chessButBetter.chessButBetter.entity.DrawOffer;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.Move;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

public class GameMapper {
    public static GameDto fromEntity(Game game, AbstractUser player1, AbstractUser player2, DrawOffer drawOffer) {
        Long player1TimeLeft = 0l;
        Long player2TimeLeft = 0l;
        if (game.getStart() != null) {
            // calculate the time left for each player in milliseconds
            player1TimeLeft = game.getStart() * 1000L;
            player2TimeLeft = game.getStart() * 1000L;
            for (Move move : game.getMoves()) {
                if (move.getId().getMoveNumber() % 2 == 0) {
                    player1TimeLeft -= game.getStartTime().until(move.getMoveTime(),
                            java.time.temporal.ChronoUnit.MILLIS);
                    //increment time for player 1
                    player1TimeLeft += game.getIncrement() * 1000L;
                } else {
                    player2TimeLeft -= game.getStartTime().until(move.getMoveTime(),
                            java.time.temporal.ChronoUnit.MILLIS);
                    //increment time for player 2
                    player2TimeLeft += game.getIncrement() * 1000L;
                }
            }
            // if game is not finished, we need to calculate the time used for the last move
            if (game.getResult() == null) {
                if (game.getMoves().size() % 2 == 0) {
                    player1TimeLeft -= game.getStartTime().until(LocalDateTime.now(),
                            java.time.temporal.ChronoUnit.MILLIS);
                } else {
                    player2TimeLeft -= game.getStartTime().until(LocalDateTime.now(),
                            java.time.temporal.ChronoUnit.MILLIS);
                }
            }
        }
        return new GameDto(game.getId(), PlayerMapper.fromEntity(player1),
                PlayerMapper.fromEntity(player2), game.getResult(),
                MoveMapper.fromEntity(game),
                DrawOfferMapper.fromEntity(drawOffer),
                game.getStartTime(),
                game.getStart(),
                game.getIncrement(),
                player1TimeLeft.intValue(),
                player2TimeLeft.intValue());
    }
}
