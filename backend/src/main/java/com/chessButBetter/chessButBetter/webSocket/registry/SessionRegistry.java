package com.chessButBetter.chessButBetter.webSocket.registry;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class SessionRegistry {

    private final SessionStorage queueSessions = new SessionStorage();
    private final SessionStorage gameSessions = new SessionStorage();
    private final ConcurrentHashMap<String, String> sessionIDToWSType = new ConcurrentHashMap<>();

    public SessionStorage getQueueSessions() {
        return queueSessions;
    }

    public SessionStorage getGameSessions() {
        return gameSessions;
    }

    public void addSession(String sessionId, String wsType) {
        sessionIDToWSType.put(sessionId, wsType);
    }

    public String getSessionType(String sessionId) {
        return sessionIDToWSType.get(sessionId);
    }

    public void removeSession(String sessionId) {
        sessionIDToWSType.remove(sessionId);
    }
}