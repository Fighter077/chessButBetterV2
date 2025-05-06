package com.chessButBetter.chessButBetter.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chessButBetter.chessButBetter.entity.QueueEntry;
import com.chessButBetter.chessButBetter.entity.User;

@Repository
public interface QueueRepository extends JpaRepository<QueueEntry, Long> {
    
    Optional<QueueEntry> findTopBy();

    boolean existsByUser(User user);

    Optional<QueueEntry> findByUser(User user);
}
