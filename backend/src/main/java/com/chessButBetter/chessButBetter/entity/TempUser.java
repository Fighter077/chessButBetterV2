package com.chessButBetter.chessButBetter.entity;

import com.chessButBetter.chessButBetter.enums.RoleType;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

import jakarta.persistence.*;

@Entity
@Table(name = "temp_users")
public class TempUser implements AbstractUser {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(optional = false, cascade = CascadeType.ALL, orphanRemoval = true)
    @MapsId
    @JoinColumn(name = "user_id")
    private UserId userIdRef;

    public TempUser() {
    }

    public TempUser(UserId id) {
        this.userId = id.getUserId();
        this.userIdRef = id;
    }

    public UserId getId() {
        return this.userIdRef;
    }

    public void setId(UserId id) {
        this.userId = id.getUserId();
        this.userIdRef = id;
    }

    public String getUsername() {
        return "Player " + this.userId.toString();
    }

    public RoleType getRole() {
        return RoleType.TEMP_USER;
    }
}
