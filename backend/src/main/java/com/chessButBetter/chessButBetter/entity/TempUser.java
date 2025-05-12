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

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    public TempUser() {
    }

    public TempUser(UserId id, String username) {
        this.userId = id.getUserId();
        this.userIdRef = id;
        this.username = username;
    }

    public UserId getId() {
        return this.userIdRef;
    }

    public void setId(UserId id) {
        this.userId = id.getUserId();
        this.userIdRef = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public RoleType getRole() {
        return RoleType.TEMP_USER;
    }
}
