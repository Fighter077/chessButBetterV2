package com.chessButBetter.chessButBetter.entity;

import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

import jakarta.persistence.*;

@Entity
@Table(name = "queue")
public class QueueEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserId userId;

    public QueueEntry() {}

    public QueueEntry(AbstractUser user) {
        this.userId = user.getId();
    }
    
    public UserId getUserId() {
        return userId;
    }

    public void setUser(AbstractUser user) {
        this.userId = user.getId();
    }
}
