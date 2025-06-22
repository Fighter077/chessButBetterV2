package com.chessButBetter.chessButBetter.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.chessButBetter.chessButBetter.entity.DrawOffer;

public interface DrawOfferRepository extends JpaRepository<DrawOffer, Long> {
        @Query("SELECT d FROM DrawOffer d WHERE d.game.id = :gameId AND d.playerId = :playerId")
        Optional<DrawOffer> findByGameIdAndPlayerId(@Param("gameId") Long gameId, @Param("playerId") Long playerId);

        @Query("SELECT d FROM DrawOffer d WHERE d.game.id = :gameId order by d.offerTime asc")
        List<DrawOffer> findByGameId(@Param("gameId") Long gameId);

        @Query("SELECT d FROM DrawOffer d WHERE d.id = " +
                        "(SELECT d1.id FROM DrawOffer d1 WHERE d1.game.id = :gameId ORDER BY d1.offerTime DESC LIMIT 1) "
                        +
                        "AND d.playerId = :playerId AND d.action = 'OFFERED'")
        Optional<DrawOffer> findOpenDrawOfferByGameIdAndPlayerId(
                        @Param("gameId") Long gameId,
                        @Param("playerId") Long playerId);

        @Query("SELECT d FROM DrawOffer d WHERE d.id = " +
                        "(SELECT d1.id FROM DrawOffer d1 WHERE d1.game.id = :gameId ORDER BY d1.offerTime DESC LIMIT 1) "
                        +
                        "AND d.action = 'OFFERED'")
        Optional<DrawOffer> findOpenDrawOfferByGameId(
                        @Param("gameId") Long gameId);

        @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END " +
                        "FROM DrawOffer d WHERE d.id = " +
                        "(SELECT d1.id FROM DrawOffer d1 WHERE d1.game.id = :gameId ORDER BY d1.offerTime DESC LIMIT 1) "
                        +
                        "AND d.playerId = :playerId AND d.action = 'OFFERED'")
        boolean existsOpenDrawOfferByGameIdAndPlayerId(
                        @Param("gameId") Long gameId,
                        @Param("playerId") Long playerId);
}
