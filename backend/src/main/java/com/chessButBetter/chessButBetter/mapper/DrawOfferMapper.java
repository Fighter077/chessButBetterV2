package com.chessButBetter.chessButBetter.mapper;

import com.chessButBetter.chessButBetter.dto.DrawOfferDto;
import com.chessButBetter.chessButBetter.entity.DrawOffer;

public class DrawOfferMapper {
    public static DrawOfferDto fromEntity(DrawOffer drawOffer) {
        if (drawOffer == null) {
            return null; // Handle the case where drawOffer is null
        }
        return new DrawOfferDto(drawOffer.getPlayerId(), drawOffer.getAction());
    }
}
