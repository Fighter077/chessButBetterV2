package com.chessButBetter.chessButBetter.dto;

import com.chessButBetter.chessButBetter.enums.DrawAction;

public class DrawOfferDto {
    private Long initiatorID;
    private DrawAction type;

    public DrawOfferDto() {
    }

    public DrawOfferDto(Long initiatorID, DrawAction type) {
        this.initiatorID = initiatorID;
        this.type = type;
    }

    public Long getInitiatorID() {
        return initiatorID;
    }

    public void setInitiatorID(Long initiatorID) {
        this.initiatorID = initiatorID;
    }

    public DrawAction getType() {
        return type;
    }

    public void setType(DrawAction type) {
        this.type = type;
    }
}
