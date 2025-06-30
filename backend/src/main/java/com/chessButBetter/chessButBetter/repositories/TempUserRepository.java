package com.chessButBetter.chessButBetter.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.chessButBetter.chessButBetter.entity.TempUser;

import jakarta.transaction.Transactional;

@Repository
public interface TempUserRepository extends JpaRepository<TempUser, Long> {
    boolean existsByUsername(String username);

    Optional<TempUser> findByUsername(String username);

    @Modifying
    @Transactional
    @Query(value = """
            DELETE FROM temp_users
            WHERE user_id = :id
            """, nativeQuery = true)
    int deleteByIdUserOnly(@Param("id") Long id);
}