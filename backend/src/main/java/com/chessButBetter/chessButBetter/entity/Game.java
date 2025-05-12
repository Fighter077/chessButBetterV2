package com.chessButBetter.chessButBetter.entity;

import java.util.ArrayList;
import java.util.List;

import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player1_id", nullable = false)
    private Long player1Id;

    @Column(name = "player2_id", nullable = false)
    private Long player2Id;

    @OneToMany(mappedBy = "game", cascade = {CascadeType.ALL}, orphanRemoval = true)
    private List<Move> moves = new ArrayList<>(); // Assuming you have a Move entity

    @Nullable
    private String result; // e.g., "1-0", "0-1", "1/2-1/2"

    public Game() {
    }

    public Game(AbstractUser player1, AbstractUser player2, List<Move> moves, String result) {
        this.player1Id = player1.getId().getUserId();
        this.player2Id = player2.getId().getUserId();
        this.moves = moves;
        this.result = result; // Store null if no result is provided
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPlayer1Id() {
        return player1Id;
    }

    public void setPlayer1(AbstractUser player1) {
        this.player1Id = player1.getId().getUserId();
    }

    public Long getPlayer2Id() {
        return player2Id;
    }

    public void setPlayer2(AbstractUser player2) {
        this.player2Id = player2.getId().getUserId();
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
