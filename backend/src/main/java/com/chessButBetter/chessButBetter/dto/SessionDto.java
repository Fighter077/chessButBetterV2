package com.chessButBetter.chessButBetter.dto;

public class SessionDto {

    private String sessionId;
    private Long userId;

    public SessionDto() {
    }

    public SessionDto(String sessionId, Long userId) {
        this.sessionId = sessionId;
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
