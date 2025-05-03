package com.chessButBetter.chessButBetter.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chessButBetter.chessButBetter.entity.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findBySessionId(String sessionId);

    Optional<Session> findByUserId(Long userId);

    List<Session> findAllByUserId(Long userId);
}
