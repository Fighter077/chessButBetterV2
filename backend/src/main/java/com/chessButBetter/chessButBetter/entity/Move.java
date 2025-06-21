package com.chessButBetter.chessButBetter.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "moves")
public class Move {

    @EmbeddedId
    private MoveId id; // Composite key (gameId, moveNumber)

    @MapsId("gameId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private Game game;

    private String move;

    @Column(name = "move_time", nullable = false)
    private LocalDateTime moveTime;

    public Move() {
    }

    public Move(Game game, String move) {
        this.game = game;
        this.move = move;
        this.moveTime = LocalDateTime.now();
    }

    public MoveId getId() {
        return id;
    }

    public void setId(MoveId id) {
        this.id = id;
    }

    public void setMoveNumber(Integer moveNumber) {
        if (this.id == null) {
            this.id = new MoveId(
                    game.getId(), moveNumber);
        }
        this.id.setMoveNumber(moveNumber);
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public String getMove() {
        return move;
    }

    public void setMove(String move) {
        this.move = move;
    }

    public LocalDateTime getMoveTime() {
        return moveTime;
    }

    public void setMoveTime(LocalDateTime moveTime) {
        this.moveTime = moveTime;
    }
}
