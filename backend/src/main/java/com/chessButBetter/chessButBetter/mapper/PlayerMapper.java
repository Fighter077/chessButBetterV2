package com.chessButBetter.chessButBetter.mapper;

import com.chessButBetter.chessButBetter.dto.PlayerDto;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

public class PlayerMapper {

    public static PlayerDto fromEntity(AbstractUser user) {
        return new PlayerDto(user.getId().getUserId(), user.getUsername());
    }
}
