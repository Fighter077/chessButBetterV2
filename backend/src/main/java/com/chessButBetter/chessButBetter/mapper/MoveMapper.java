package com.chessButBetter.chessButBetter.mapper;

import java.time.LocalDateTime;
import java.util.List;

import com.chessButBetter.chessButBetter.dto.MoveDto;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.Move;

public class MoveMapper {
    public static MoveDto fromEntity(Move move) {
        return new MoveDto(move.getMove(), move.getId().getMoveNumber());
    }

    public static MoveDto fromEntity(Move move, LocalDateTime previous) {
        Long timeUsed = previous.until(move.getMoveTime(), java.time.temporal.ChronoUnit.MILLIS);
        return new MoveDto(move.getMove(), move.getId().getMoveNumber(), timeUsed.intValue());
    }

    public static List<MoveDto> fromEntity(Game game) {
        List<Move> moves = game.getMoves();
        List<MoveDto> moveDtos = new java.util.ArrayList<>();
        LocalDateTime prevMoveTime = game.getStartTime();
        for (Move move : moves) {
            moveDtos.add(MoveMapper.fromEntity(move, prevMoveTime));
            prevMoveTime = move.getMoveTime();
        }
        return moveDtos;
    }

    public static LocalDateTime lastMoveTime(Game game, int moveNumber) {
        if (game.getMoves().isEmpty()) {
            return game.getStartTime();
        }
        List<Move> moves = game.getMoves();
        List<MoveDto> moveDtos = new java.util.ArrayList<>();
        LocalDateTime prevMoveTime = game.getStartTime();
        for (Move move : moves) {
            if (move.getId().getMoveNumber() > moveNumber) {
                break; // Stop processing if we reach a move number greater than the specified one
            }
            moveDtos.add(MoveMapper.fromEntity(move, prevMoveTime));
            prevMoveTime = move.getMoveTime();
        }
        return prevMoveTime;
    }
}
