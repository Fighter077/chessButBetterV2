package com.chessButBetter.chessButBetter.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chessButBetter.chessButBetter.entity.TempUser;

@Repository
public interface TempUserRepository extends JpaRepository<TempUser, Long> {
    boolean existsByUsername(String username);

    Optional<TempUser> findByUsername(String username);
}