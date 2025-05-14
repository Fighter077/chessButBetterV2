package com.chessButBetter.chessButBetter.dto;

import com.chessButBetter.chessButBetter.enums.RoleType;

public class UserDto {

    private Long id;
    
    private String username;

    private RoleType role;

    public UserDto() {
    }

    public UserDto(Long id, String username, String password, RoleType role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public RoleType getRole() {
        return role;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }
}
