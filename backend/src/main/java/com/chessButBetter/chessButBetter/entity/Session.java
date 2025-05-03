package com.chessButBetter.chessButBetter.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "sessions")
public class Session {
    
    @Id private String sessionId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime createdAt;

    public Session() {}

    public Session(User user) {
        this.sessionId = generateSessionId(); // Implement this method to generate a unique session ID
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
