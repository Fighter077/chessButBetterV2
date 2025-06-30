package com.chessButBetter.chessButBetter.service.impl;

import org.springframework.stereotype.Service;

import com.chessButBetter.chessButBetter.dto.CookieConsentDto;
import com.chessButBetter.chessButBetter.entity.CookieAcceptance;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.repositories.CookieRepository;
import com.chessButBetter.chessButBetter.service.CookieService;

@Service
public class CookieServiceImpl implements CookieService {

    private final CookieRepository cookieRepository;

    public CookieServiceImpl(CookieRepository cookieRepository) {
        this.cookieRepository = cookieRepository;
    }

    @Override
    public CookieAcceptance storeAcceptance(CookieConsentDto consent, AbstractUser user, String sessionId, String ipAddress) {
        CookieAcceptance acceptance = new CookieAcceptance(user != null ? user.getId() : null, consent.getAcceptanceLevel(), sessionId, ipAddress);
        return cookieRepository.save(acceptance);
    }
    
}
