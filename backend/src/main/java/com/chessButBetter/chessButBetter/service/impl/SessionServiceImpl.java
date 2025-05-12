package com.chessButBetter.chessButBetter.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.chessButBetter.chessButBetter.entity.Session;
import com.chessButBetter.chessButBetter.entity.UserId;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.repositories.SessionRepository;
import com.chessButBetter.chessButBetter.service.SessionService;

@Service
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;

    public SessionServiceImpl(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    public Session createSession(AbstractUser user) {
        Session session = new Session(user);
        return sessionRepository.save(session);
    }

    @Override
    public Session getSessionById(String sessionId) {
        return sessionRepository.findBySessionId(sessionId).orElse(null);
    }

    @Override
    public List<Session> getAllSessionsByUserId(Long userId) {
        return sessionRepository.findAllByUserId(new UserId(userId));
    }

    @Override
    public Session deleteSessionById(String sessionId) {
        Session session = getSessionById(sessionId);
        if (session != null) {
            sessionRepository.delete(session);
        }
        return session;
    }

}
