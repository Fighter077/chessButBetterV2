package com.chessButBetter.chessButBetter.mapper;

import com.chessButBetter.chessButBetter.dto.MoveErrorDto;
import com.chessButBetter.chessButBetter.entity.Move;

public class MoveErrorMapper {
    public static MoveErrorDto fromEntity(Move move) {
        return new MoveErrorDto(move.getId().getMoveNumber());
    }
}
