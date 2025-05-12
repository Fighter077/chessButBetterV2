package com.chessButBetter.chessButBetter.service;

import java.util.Optional;

import com.chessButBetter.chessButBetter.entity.TempUser;

public interface TempUserService {
    
    public TempUser createUser();

    public Optional<TempUser> getUserById(Long id);

    public Optional<TempUser> getUserByUsername(String username);

    public TempUser deleteUser(Long id);
}
