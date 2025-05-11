package com.chessButBetter.chessButBetter.service;

import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.exception.InvalidPasswordException;
import com.chessButBetter.chessButBetter.exception.UserAlreadyExistsException;
import com.chessButBetter.chessButBetter.exception.UserNotFoundException;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface UserService {

    List<User> getAllUsers();

    Optional<AbstractUser> getUserById(Long id);

    AbstractUser createUser(AbstractUser user);

    User deleteUser(Long id);

    User updateUser(User user);

    User registerUser(User user) throws UserAlreadyExistsException;

    User loginUser(User user) throws UserNotFoundException, InvalidPasswordException;
}
