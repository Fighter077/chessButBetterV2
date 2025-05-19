package com.chessButBetter.chessButBetter.mapper;

import com.chessButBetter.chessButBetter.dto.DrawOfferDto;
import com.chessButBetter.chessButBetter.entity.DrawOffer;

public class DrawOfferMapper {
    public static DrawOfferDto fromEntity(DrawOffer drawOffer) {
        return new DrawOfferDto(drawOffer.getPlayerId(), drawOffer.getAction());
    }
}
