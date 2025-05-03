package com.chessButBetter.chessButBetter.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String username) {
        super("User with username " + username + " already exists.");
    }

    public UserAlreadyExistsException(String username, String email) {
        super("User with email " + email + " already exists.");
    }
}
