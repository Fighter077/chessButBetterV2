package com.chessButBetter.chessButBetter.entity;

import java.time.LocalDateTime;

import com.chessButBetter.chessButBetter.enums.AcceptanceLevel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "cookie_acceptance")
public class CookieAcceptance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "acceptance_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private UserId userId;

    @Column(name = "acceptance_level", nullable = false)
    @Enumerated(EnumType.STRING)
    private AcceptanceLevel acceptanceLevel;

    
    @Column(name = "acceptance_time", nullable = false)
    private LocalDateTime acceptanceTime;

    @Column(name = "session_id", nullable = true)
    private String sessionId;

    @Column(name = "ip_address", nullable = true)
    private String ipAddress;

    public CookieAcceptance() {
    }

    public CookieAcceptance(UserId userId, AcceptanceLevel acceptanceLevel, String sessionId, String ipAddress) {
        this.userId = userId;
        this.acceptanceLevel = acceptanceLevel;
        this.acceptanceTime = LocalDateTime.now();
        this.sessionId = sessionId;
        this.ipAddress = ipAddress;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserId getUserId() {
        return userId;
    }

    public void setUserId(UserId userId) {
        this.userId = userId;
    }

    public AcceptanceLevel getAcceptanceLevel() {
        return acceptanceLevel;
    }

    public void setAcceptanceLevel(AcceptanceLevel acceptanceLevel) {
        this.acceptanceLevel = acceptanceLevel;
    }

    public LocalDateTime getAcceptanceTime() {
        return acceptanceTime;
    }

    public void setAcceptanceTime(LocalDateTime acceptanceTime) {
        this.acceptanceTime = acceptanceTime;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
}
