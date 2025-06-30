package com.chessButBetter.chessButBetter.dto;

import com.chessButBetter.chessButBetter.enums.AcceptanceLevel;

public class CookieConsentDto {
    AcceptanceLevel acceptanceLevel;

    public CookieConsentDto() {
    }

    public CookieConsentDto(AcceptanceLevel acceptanceLevel) {
        this.acceptanceLevel = acceptanceLevel;
    }

    public AcceptanceLevel getAcceptanceLevel() {
        return acceptanceLevel;
    }

    public void setAcceptanceLevel(AcceptanceLevel acceptanceLevel) {
        this.acceptanceLevel = acceptanceLevel;
    }
}
