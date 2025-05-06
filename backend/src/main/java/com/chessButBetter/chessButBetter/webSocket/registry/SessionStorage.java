package com.chessButBetter.chessButBetter.webSocket.registry;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

public class SessionStorage {
    private final ConcurrentHashMap<Long, CopyOnWriteArrayList<String>> userIdToSessionIdMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> sessionIdToUserIdMap = new ConcurrentHashMap<>();

    public void register(Long userId, String session) {
        // Check if the session is already registered for the user
        if (sessionIdToUserIdMap.containsKey(session)) {
            return;
        }
        // Register the session for the user
        userIdToSessionIdMap.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>()).add(session);
        sessionIdToUserIdMap.put(session, userId);
    }

    public void unregister(Long userId, String sessionId) {
        // Unregister the session for the user
        CopyOnWriteArrayList<String> sessions = userIdToSessionIdMap.get(userId);
        if (sessions != null && sessions.remove(sessionId)) {
            sessionIdToUserIdMap.remove(sessionId);
            if (sessions.isEmpty()) {
                userIdToSessionIdMap.remove(userId);
            }
        }
    }

    public void unregisterSession(String sessionId) {
        // Unregister the session from all users
        Long userId = sessionIdToUserIdMap.remove(sessionId);
        if (userId != null) {
            CopyOnWriteArrayList<String> sessions = userIdToSessionIdMap.get(userId);
            if (sessions != null && sessions.remove(sessionId) && sessions.isEmpty()) {
                userIdToSessionIdMap.remove(userId);
            }
        }
    }

    public List<String> getSessions(Long userId) {
        // Get the sessions for the user
        CopyOnWriteArrayList<String> sessions = userIdToSessionIdMap.get(userId);
        if (sessions != null) {
            return List.copyOf(sessions);
        } else {
            return List.of();
        }
    }

    public Long getUserId(String sessionId) {
        // Get the user ID for the session
        Long userId = sessionIdToUserIdMap.get(sessionId);
        if (userId != null) {
            return userId;
        } else {
            return null;
        }
    }

    public List<Long> getAllUserIds() {
        // Get all user IDs
        return List.copyOf(userIdToSessionIdMap.keySet());
    }
}
