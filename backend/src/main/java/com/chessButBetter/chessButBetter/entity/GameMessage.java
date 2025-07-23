package com.chessButBetter.chessButBetter.entity;

import java.time.LocalDateTime;

import com.chessButBetter.chessButBetter.interfaces.Message;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "game_messages")
public class GameMessage implements Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name="game_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Game game;

    @Column(name="content", nullable = false)
    private String content;

    @Column(name="sender_id", nullable = false)
    private Long senderId;

    @Column(name="timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name="is_public", nullable = false)
    private Boolean isPublic;

    public GameMessage(Game game, String content, Long senderId, Boolean isPublic) {
        this.game = game;
        this.content = content;
        this.senderId = senderId;
        this.timestamp = LocalDateTime.now();
        this.isPublic = isPublic;
    }

    public GameMessage(Game game, String content, Long senderId, LocalDateTime timestamp, Boolean isPublic) {
        this.game = game;
        this.content = content;
        this.senderId = senderId;
        this.timestamp = timestamp;
        this.isPublic = isPublic;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    @Override
    public String getContent() {
        return content;
    }

    @Override
    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public Long getSenderId() {
        return senderId;
    }

    @Override
    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    @Override
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    @Override
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    @Override
    public boolean isChatMessage() {
        return false;
    }
}
