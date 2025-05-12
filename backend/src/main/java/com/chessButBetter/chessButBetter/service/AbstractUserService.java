package com.chessButBetter.chessButBetter.service;

import java.util.Optional;

import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

public interface AbstractUserService {
    public Optional<AbstractUser> findByUsername(String username);

    public Optional<AbstractUser> getUserById(Long id);

    public AbstractUser registerUser(AbstractUser user);

    public AbstractUser convertTempUser(AbstractUser tempUser, AbstractUser newUser);
}
