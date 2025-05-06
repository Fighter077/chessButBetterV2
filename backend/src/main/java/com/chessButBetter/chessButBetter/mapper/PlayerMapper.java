package com.chessButBetter.chessButBetter.mapper;

import com.chessButBetter.chessButBetter.dto.PlayerDto;
import com.chessButBetter.chessButBetter.entity.User;

public class PlayerMapper {
    public static PlayerDto fromEntity(User user) {
        return new PlayerDto(user.getId(), user.getUsername());
    }
}
