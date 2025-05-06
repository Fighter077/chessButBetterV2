package com.chessButBetter.chessButBetter.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class MoveId implements Serializable {

    private Long gameId;
    private Integer moveNumber;

    public MoveId() {}  // Required by JPA

    public MoveId(Long gameId, Integer moveNumber) {
        this.gameId = gameId;
        this.moveNumber = moveNumber;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Integer getMoveNumber() {
        return moveNumber;
    }

    public void setMoveNumber(Integer moveNumber) {
        this.moveNumber = moveNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MoveId)) return false;
        MoveId that = (MoveId) o;
        return moveNumber == that.moveNumber &&
                Objects.equals(gameId, that.gameId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(gameId, moveNumber);
    }
}