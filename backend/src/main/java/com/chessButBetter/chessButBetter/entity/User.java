package com.chessButBetter.chessButBetter.entity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.chessButBetter.chessButBetter.enums.RoleType;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @JsonProperty("id")
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    public User() {}

    public User(Long id, String username, String password, String email, RoleType role) {
        this.id = id;
        this.username = username;
        this.password = new BCryptPasswordEncoder().encode(password);
        this.email = email;
        this.role = role;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return this.id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return this.username;
    }

    public void setPassword(String password) {
        this.password = new BCryptPasswordEncoder().encode(password);
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
}
