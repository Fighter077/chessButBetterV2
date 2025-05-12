package com.chessButBetter.chessButBetter.service;

import java.util.List;

import com.chessButBetter.chessButBetter.entity.Session;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

public interface SessionService {
    
    Session createSession(AbstractUser session);

    Session getSessionById(String sessionId);

    List<Session> getAllSessionsByUserId(Long userId);

    Session deleteSessionById(String sessionId);
}
