package com.chessButBetter.chessButBetter.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.chessButBetter.chessButBetter.entity.TempUser;
import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.entity.UserId;
import com.chessButBetter.chessButBetter.enums.RoleType;
import com.chessButBetter.chessButBetter.exception.InvalidPasswordException;
import com.chessButBetter.chessButBetter.exception.UserAlreadyExistsException;
import com.chessButBetter.chessButBetter.exception.UserNotFoundException;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.repositories.TempUserRepository;
import com.chessButBetter.chessButBetter.repositories.UserRepository;
import com.chessButBetter.chessButBetter.service.UserIdService;
import com.chessButBetter.chessButBetter.service.UserService;

import jakarta.persistence.EntityManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserIdService userIdService;
    private final TempUserRepository tempUserRepository;

    @Autowired
    EntityManager entityManager;

    private final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    public UserServiceImpl(UserRepository userRepository, TempUserRepository tempUserRepository, UserIdService userIdService) {
        this.userRepository = userRepository;
        this.tempUserRepository = tempUserRepository;
        this.userIdService = userIdService;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<AbstractUser> getUserById(Long id) {
        Optional<? extends AbstractUser> user = userRepository.findById(id).map(u -> (AbstractUser) u);

        if (user.isPresent()) {
            return Optional.of(user.get());
        }

        return tempUserRepository.findById(id).map(t -> (AbstractUser) t);
    }

    @Override
    public AbstractUser createUser(AbstractUser user) {
        logger.info("Creating user: " + user.getUsername());
        
        if (user instanceof User) {
            return userRepository.save((User) user);
        }
        return tempUserRepository.save((TempUser) user);
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
    public User registerUser(User user) throws UserAlreadyExistsException {
        logger.info("Registering user: " + user.getUsername());
        // check if username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException(user.getUsername());
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException(user.getUsername(), user.getEmail());
        }
        // hash password
        String hashedPassword = new BCryptPasswordEncoder().encode(user.getPassword());
        user.setPassword(hashedPassword);

        // create new user
        if (user.getRole() == null) {
            user.setRole(RoleType.USER); // Set default role to USER
        }
        user.setId(new UserId());
        // save user to database
        return userRepository.save(user);
        //return user;
    }

    @Override
    public User loginUser(User user) throws UserNotFoundException, InvalidPasswordException {
        // check if user exists
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            User foundUser = existingUser.get();
            // check if password is correct
            if (new BCryptPasswordEncoder().matches(user.getPassword(), foundUser.getPassword())) {
                // password is correct, return user
                return foundUser;
            } else {
                throw new InvalidPasswordException(user.getUsername() + " password is incorrect");
            }
        } else {
            throw new UserNotFoundException(user.getUsername() + " not found");
        }
    }
}
