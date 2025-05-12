package com.chessButBetter.chessButBetter.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_ids")
public class UserId {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    public UserId() {}

    public UserId(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}