package com.chessButBetter.chessButBetter.entity;

import java.time.LocalDateTime;

import com.chessButBetter.chessButBetter.enums.DrawAction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "draw_offers")
public class DrawOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", referencedColumnName = "id", nullable = false)
    private Game game;

    @Column(name = "player_id", nullable = false)
    private Long playerId;

    @Column(name = "offer_time", nullable = false)
    private LocalDateTime offerTime;

    @Column(name = "action", nullable = false)
    @Enumerated(EnumType.STRING)
    private DrawAction action;

    public DrawOffer() {
    }

    public DrawOffer(Game game, Long playerId, DrawAction action) {
        this.game = game;
        this.playerId = playerId;
        this.offerTime = LocalDateTime.now();
        this.action = action;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public LocalDateTime getOfferTime() {
        return offerTime;
    }

    public void setOfferTime(LocalDateTime offerTime) {
        this.offerTime = offerTime;
    }

    public DrawAction getAction() {
        return action;
    }

    public void setAction(DrawAction action) {
        this.action = action;
    }
}
