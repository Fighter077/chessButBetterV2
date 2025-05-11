package com.chessButBetter.chessButBetter.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.chessButBetter.chessButBetter.entity.UserId;

@Repository
public interface UserIdRepository extends JpaRepository<UserId, Long> {
    // This repository is used to manage UserId entities in the database.
    // It extends JpaRepository to provide CRUD operations and custom query methods.
    // You can add custom query methods here if needed.
}
