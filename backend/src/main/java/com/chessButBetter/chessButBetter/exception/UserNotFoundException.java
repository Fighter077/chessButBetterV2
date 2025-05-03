package com.chessButBetter.chessButBetter.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String username) {
        super("User not found: " + username);
    }

    public UserNotFoundException(Long id) {
        super("User not found: " + id);
    }
}
