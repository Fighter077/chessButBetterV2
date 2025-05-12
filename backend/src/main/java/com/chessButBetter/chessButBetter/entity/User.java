package com.chessButBetter.chessButBetter.entity;

import com.chessButBetter.chessButBetter.enums.RoleType;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User implements AbstractUser {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(optional = false, cascade = CascadeType.ALL, orphanRemoval = true)
    @MapsId
    @JoinColumn(name = "user_id")
    private UserId userIdRef;

    @JsonProperty("username")
    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

    @JsonProperty("email")
    @Column(name = "email", nullable = false)
    private String email;

    @JsonProperty("role")
    @Enumerated(EnumType.STRING)
    private RoleType role;

    public User() {
    }

    public User(UserId id, String username, String password, String email, RoleType role) {
        this.userId = id.getUserId();
        this.userIdRef = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    public void setId(UserId id) {
        this.userId = id.getUserId();
        this.userIdRef = id;
    }

    public UserId getId() {
        return this.userIdRef;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return this.username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return this.password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmail() {
        return this.email;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }

    public RoleType getRole() {
        return this.role;
    }

    public Boolean getTemp() {
        return false;
    }
}
