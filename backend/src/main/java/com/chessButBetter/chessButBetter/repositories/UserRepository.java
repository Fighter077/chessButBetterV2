package com.chessButBetter.chessButBetter.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.chessButBetter.chessButBetter.entity.User;

import jakarta.transaction.Transactional;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = """
            INSERT INTO users (user_id, username, password, email, role)
            VALUES (:id, :username, :password, :email, :role)
            """, nativeQuery = true)
    int saveNew(@Param("id") Long id,
            @Param("username") String username,
            @Param("password") String password,
            @Param("email") String email,
            @Param("role") String role);
}