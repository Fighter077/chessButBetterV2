package com.chessButBetter.chessButBetter.service;

import java.util.List;

import com.chessButBetter.chessButBetter.entity.Session;
import com.chessButBetter.chessButBetter.entity.User;

public interface SessionService {
    
    Session createSession(User session);

    Session getSessionById(String sessionId);

    List<Session> getAllSessionsByUserId(Long userId);
}
