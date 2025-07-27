package com.chessButBetter.chessButBetter.entity;


import com.chessButBetter.chessButBetter.enums.RoleType;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "oauth_temp_users")
public class OAuthTempUser implements AbstractUser {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(optional = false, cascade = CascadeType.ALL, orphanRemoval = true)
    @MapsId
    @JoinColumn(name = "user_id")
    private UserId userIdRef;

    @Column(name = "email")
    private String email;

    @Column(name = "provider")
    private String provider;

    public OAuthTempUser() {
    }

    public OAuthTempUser(UserId id, String email, String provider) {
        this.userId = id.getUserId();
        this.userIdRef = id;
        this.email = email;
        this.provider = provider;
    }

    public UserId getId() {
        return this.userIdRef;
    }

    public void setId(UserId id) {
        this.userId = id.getUserId();
        this.userIdRef = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getUsername() {
        return "OAuth User";
    }

    public void setUsername(String username) {
        // OAuth users do not have a specific username
    }

    public RoleType getRole() {
        return RoleType.O_AUTH_TEMP_USER;
    }
}
