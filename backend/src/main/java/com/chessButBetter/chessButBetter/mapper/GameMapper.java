package com.chessButBetter.chessButBetter.mapper;

import java.time.Duration;
import java.time.LocalDateTime;

import com.chessButBetter.chessButBetter.dto.GameDto;
import com.chessButBetter.chessButBetter.entity.DrawOffer;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.Move;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

public class GameMapper {
    public static GameDto fromEntity(Game game, AbstractUser player1, AbstractUser player2, DrawOffer drawOffer) {
        long player1TimeLeft = game.getStart() == null ? 0 : game.getStart() * 1_000L;
        long player2TimeLeft = player1TimeLeft;

        LocalDateTime endTime = game.getEndTime();

        if (game.getStart() != null) {
            LocalDateTime now = LocalDateTime.now();

            LocalDateTime previous = game.getStartTime();
            long incrementMillis = game.getIncrement() * 1_000L;

            for (Move move : game.getMoves()) {

                long spent = Duration.between(previous, move.getMoveTime()).toMillis();

                // In most chess databases move #1 is White, i.e. player 1 → odd.
                // If your numbering starts with 0, flip the condition.
                if (move.getId().getMoveNumber() % 2 == 0) {
                    player1TimeLeft -= spent;
                    player1TimeLeft += incrementMillis;
                } else {
                    player2TimeLeft -= spent;
                    player2TimeLeft += incrementMillis;
                }

                previous = move.getMoveTime(); // next delta starts here
            }

            // Game still running – subtract time since the last move
            if (game.getResult() == null && previous != null) {
                long spent = Duration.between(previous, now).toMillis();
                if (game.getMoves().size() % 2 == 0) { // player 1 to move
                    player1TimeLeft -= spent;
                } else { // player 2 to move
                    player2TimeLeft -= spent;
                }
            }
            if (game.getEndTime() != null) {
                // If the game has ended, we need to adjust the time left
                long endTimeMillis = Duration.between(previous, game.getEndTime()).toMillis();
                if (game.getMoves().size() % 2 == 0) { // player 1 to move
                    player1TimeLeft -= endTimeMillis;
                } else { // player 2 to move
                    player2TimeLeft -= endTimeMillis;
                }
            } else {
                // If the game is still ongoing, but the time ran out, set the end time
                if (player1TimeLeft <= 0) {
                    endTime = now.plus(Duration.ofMillis(player1TimeLeft));
                }
                if (player2TimeLeft <= 0) {
                    endTime = now.plus(Duration.ofMillis(player2TimeLeft));
                }
            }
        }

        /*--- clamp to int / handle “no clock” games ------------------------------*/
        Integer player1TimeLeftInt = game.getStart() == null ? 0
                : Math.toIntExact(Math.max(0, player1TimeLeft));
        Integer player2TimeLeftInt = game.getStart() == null ? 0
                : Math.toIntExact(Math.max(0, player2TimeLeft));
        return new GameDto(game.getId(), PlayerMapper.fromEntity(player1),
                PlayerMapper.fromEntity(player2), game.getResult(),
                MoveMapper.fromEntity(game),
                DrawOfferMapper.fromEntity(drawOffer),
                game.getStartTime(),
                endTime,
                game.getStart(),
                game.getIncrement(),
                player1TimeLeftInt,
                player2TimeLeftInt);
    }
}
