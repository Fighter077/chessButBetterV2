package com.chessButBetter.chessButBetter.mapper;

import com.chessButBetter.chessButBetter.dto.MoveDto;
import com.chessButBetter.chessButBetter.entity.Move;

public class MoveMapper {
    public static MoveDto fromEntity(Move move) {
        return new MoveDto(move.getMove(), move.getId().getMoveNumber());
    }
}
