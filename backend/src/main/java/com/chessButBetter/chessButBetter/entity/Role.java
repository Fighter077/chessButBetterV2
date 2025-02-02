package com.chessButBetter.chessButBetter.entity;

public class Role {
    public static final Role USER = new Role("USER");
    public static final Role ADMIN = new Role("ADMIN");

    private String role;

    public Role(String role) {
        this.role = role;
    }

    public String getRole() {
        return this.role;
    }
}
