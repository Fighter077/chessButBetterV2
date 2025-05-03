package com.chessButBetter.chessButBetter.dto;

import com.chessButBetter.chessButBetter.enums.RoleType;

public class SessionDto {

    private String sessionId;
    private Long userId;
    private RoleType role;

    public SessionDto() {
    }

    public SessionDto(String sessionId, Long userId, RoleType role) {
        this.sessionId = sessionId;
        this.userId = userId;
        this.role = role;
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

    public RoleType getRole() {
        return role;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }
}
