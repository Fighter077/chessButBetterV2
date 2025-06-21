package com.chessButBetter.chessButBetter.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.chessButBetter.chessButBetter.entity.TempUser;
import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.exception.UserAlreadyExistsException;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.service.AbstractUserService;
import com.chessButBetter.chessButBetter.service.TempUserService;
import com.chessButBetter.chessButBetter.service.UserService;

@Service
public class AbstractUserServiceImpl implements AbstractUserService {

    private final UserService userService;
    private final TempUserService tempUserService;

    public AbstractUserServiceImpl(UserService userService, TempUserService tempUserService) {
        this.userService = userService;
        this.tempUserService = tempUserService;
    }

    @Override
    public Optional<AbstractUser> findByUsername(String username) {
        Optional<User> user = userService.getUserByUsername(username);
        if (user.isPresent()) {
            return Optional.of(user.get());
        }
        Optional<TempUser> tempUser = tempUserService.getUserByUsername(username);
        if (tempUser.isPresent()) {
            return Optional.of(tempUser.get());
        }
        return Optional.empty();
    }

    @Override
    public Optional<AbstractUser> getUserById(Long id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            return Optional.of(user.get());
        }
        Optional<TempUser> tempUser = tempUserService.getUserById(id);
        if (tempUser.isPresent()) {
            return Optional.of(tempUser.get());
        }
        return Optional.empty();
    }

    @Override
    public AbstractUser registerUser(AbstractUser user) {
        // check if username or email or id already exists
        if (this.findByUsername(user.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException(user.getUsername() + " already exists");
        }
        if (user.getId() != null && this.getUserById(user.getId().getUserId()).isPresent()) {
            throw new UserAlreadyExistsException("User ID already exists");
        }

        if (user instanceof User) {
            User userObj = (User) user;
            if (userService.getUserByEmail(userObj.getEmail()).isPresent()) {
                throw new UserAlreadyExistsException(userObj.getUsername() + " already exists", userObj.getEmail());
            }
            return userService.registerUser(userObj);
        } else if (user instanceof TempUser) {
            return tempUserService.createUser();
        } else {
            throw new IllegalArgumentException("Unknown user type");
        }
    }
    
    @Override
    public AbstractUser convertTempUser(AbstractUser tempUser, AbstractUser newUser) {
        if (tempUser instanceof TempUser && newUser instanceof User) {
            TempUser temp = (TempUser) tempUser;
            User user = (User) newUser;
            user.setId(temp.getId());
            userService.createUser(user);
            tempUserService.deleteUser(temp.getId().getUserId());
        }
        throw new IllegalArgumentException("Invalid user types for conversion");
    }
}
