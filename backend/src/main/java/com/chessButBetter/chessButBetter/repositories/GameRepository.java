package com.chessButBetter.chessButBetter.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.chessButBetter.chessButBetter.entity.Game;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    @Query(value = """
            SELECT g FROM Game g
            WHERE g.player1Id = :userId OR g.player2Id = :userId
            AND g.result IS NULL
            """)
    Optional<Game> findOpenGameByUserId(@Param("userId") Long userId);

    @Query("SELECT g FROM Game g LEFT JOIN FETCH g.moves WHERE g.id = :id")
    Optional<Game> findByIdWithMoves(@Param("id") Long id);
}
