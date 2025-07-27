package com.chessButBetter.chessButBetter.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chessButBetter.chessButBetter.entity.OAuthTempUser;
@Repository
public interface OAuthTempUserRepository extends JpaRepository<OAuthTempUser, Long> {
    Optional<OAuthTempUser> findByEmail(String email);

}
