package com.chessButBetter.chessButBetter.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chessButBetter.chessButBetter.entity.Move;
import com.chessButBetter.chessButBetter.entity.MoveId;

public interface MoveRepository extends JpaRepository<Move, MoveId> {

    List<Move> findByGameId(Long gameId);
}
