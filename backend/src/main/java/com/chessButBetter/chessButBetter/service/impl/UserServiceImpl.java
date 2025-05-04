package com.chessButBetter.chessButBetter.service.impl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.chessButBetter.chessButBetter.dto.LoginDto;
import com.chessButBetter.chessButBetter.dto.UserDto;
import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.enums.RoleType;
import com.chessButBetter.chessButBetter.exception.InvalidPasswordException;
import com.chessButBetter.chessButBetter.exception.UserAlreadyExistsException;
import com.chessButBetter.chessButBetter.exception.UserNotFoundException;
import com.chessButBetter.chessButBetter.repositories.UserRepository;
import com.chessButBetter.chessButBetter.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User deleteUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.deleteById(id);
            return user.get();
        }
        return null;
    }

    @Override
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User registerUser(UserDto user) throws UserAlreadyExistsException {
        //check if username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException(user.getUsername());
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException(user.getUsername(), user.getEmail());
        }
        //create new user
        User newUser = new User();
        newUser.setUsername(user.getUsername());
        logger.info("Password to register: " + user.getPassword());
        newUser.setPassword(user.getPassword());
        logger.info("Encrypted password to register: " + newUser.getPassword());
        newUser.setEmail(user.getEmail());
        newUser.setRole(RoleType.USER); // Set default role to USER
        //save user to database
        return userRepository.save(newUser);
    }

    @Override
    public User loginUser(LoginDto user) throws UserNotFoundException, InvalidPasswordException {
        //check if user exists
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            User foundUser = existingUser.get();
            //check if password is correct
            if (new BCryptPasswordEncoder().matches(user.getPassword(), foundUser.getPassword())) {
                //password is correct, return user
                return foundUser;
            } else {
                throw new InvalidPasswordException(user.getUsername() + " password is incorrect");
            }
        } else {
            throw new UserNotFoundException(user.getUsername() + " not found");
        }
    }
}


