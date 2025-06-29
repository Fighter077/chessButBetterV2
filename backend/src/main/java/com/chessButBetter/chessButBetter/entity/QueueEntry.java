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

    @Column(name = "start", nullable = true)
    private Integer start;

    @Column(name = "increment", nullable = true)
    private Integer increment;

    public QueueEntry() {}

    public QueueEntry(AbstractUser user) {
        this.userId = user.getId();
        this.start = null;
        this.increment = null;
    }

    public QueueEntry(AbstractUser user, Integer start, Integer increment) {
        this.userId = user.getId();
        this.start = start;
        this.increment = increment;
    }
    
    public UserId getUserId() {
        return userId;
    }

    public void setUser(AbstractUser user) {
        this.userId = user.getId();
    }

    public Integer getStart() {
        return start;
    }

    public void setStart(Integer start) {
        this.start = start;
    }

    public Integer getIncrement() {
        return increment;
    }

    public void setIncrement(Integer increment) {
        this.increment = increment;
    }
}
