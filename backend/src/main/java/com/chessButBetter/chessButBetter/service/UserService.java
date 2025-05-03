package com.chessButBetter.chessButBetter.service;

import com.chessButBetter.chessButBetter.dto.LoginDto;
import com.chessButBetter.chessButBetter.dto.UserDto;
import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.exception.InvalidPasswordException;
import com.chessButBetter.chessButBetter.exception.UserAlreadyExistsException;
import com.chessButBetter.chessButBetter.exception.UserNotFoundException;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface UserService {

    List<User> getAllUsers();

    User getUserById(Long id);

    User createUser(User user);

    User deleteUser(Long id);

    User updateUser(User user);

    User registerUser(UserDto user) throws UserAlreadyExistsException;

    User loginUser(LoginDto user) throws UserNotFoundException, InvalidPasswordException;
}
