package com.chessButBetter.chessButBetter.dto;

public class OAuthUserInfo {
    private String email;

    public OAuthUserInfo() {
    }

    public OAuthUserInfo(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
