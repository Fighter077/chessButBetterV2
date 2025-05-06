package com.chessButBetter.chessButBetter.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.Nullable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "player1_id", nullable = false)
    private User player1;

    @ManyToOne
    @JoinColumn(name = "player2_id", nullable = false)
    private User player2;

    @OneToMany(mappedBy = "game", cascade = {CascadeType.ALL}, orphanRemoval = true)
    private List<Move> moves = new ArrayList<>(); // Assuming you have a Move entity

    @Nullable
    private String result; // e.g., "1-0", "0-1", "1/2-1/2"

    public Game() {
    }

    public Game(User player1, User player2, List<Move> moves, String result) {
        this.player1 = player1;
        this.player2 = player2;
        this.moves = moves;
        this.result = result; // Store null if no result is provided
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getPlayer1() {
        return player1;
    }

    public void setPlayer1(User player1) {
        this.player1 = player1;
    }

    public User getPlayer2() {
        return player2;
    }

    public void setPlayer2(User player2) {
        this.player2 = player2;
    }

    public List<Move> getMoves() {
        return moves;
    }

    public void setMoves(List<Move> moves) {
        this.moves = moves;
    }

    public void addMove(Move move) {
        moves.add(move);
        move.setGame(this); // Set the game reference in the move
    }

    public void removeMove(Move move) {
        moves.remove(move);
        move.setGame(null); // Remove the game reference in the move
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}
