package com.chessButBetter.chessButBetter.entity;

import java.time.LocalDateTime;

import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

import jakarta.persistence.*;

@Entity
@Table(name = "sessions")
public class Session {
    
    @Id private String sessionId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserId userId;

    private LocalDateTime createdAt;

    public Session() {}

    public Session(AbstractUser user) {
        this.sessionId = generateSessionId(); // Implement this method to generate a unique session ID
        this.userId = user.getId();
        this.createdAt = LocalDateTime.now();
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public UserId getUserId() {
        return userId;
    }

    public void setUser(AbstractUser user) {
        this.userId = user.getId();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    private String generateSessionId() {
        // Implement a method to generate a unique session ID, e.g., using UUID
        return java.util.UUID.randomUUID().toString();
    }
}
