package com.chessButBetter.chessButBetter.service;


import com.chessButBetter.chessButBetter.dto.CookieConsentDto;
import com.chessButBetter.chessButBetter.entity.CookieAcceptance;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

public interface CookieService {
    public CookieAcceptance storeAcceptance(CookieConsentDto consent, AbstractUser user, String sessionId, String ipAddress);
}
