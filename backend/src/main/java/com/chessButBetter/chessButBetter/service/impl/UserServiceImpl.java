package com.chessButBetter.chessButBetter.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.chessButBetter.chessButBetter.dto.OAuthUserInfo;
import com.chessButBetter.chessButBetter.entity.OAuthTempUser;
import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.entity.UserId;
import com.chessButBetter.chessButBetter.enums.RoleType;
import com.chessButBetter.chessButBetter.exception.InvalidPasswordException;
import com.chessButBetter.chessButBetter.exception.UserAlreadyExistsException;
import com.chessButBetter.chessButBetter.exception.UserNotFoundException;
import com.chessButBetter.chessButBetter.repositories.OAuthTempUserRepository;
import com.chessButBetter.chessButBetter.repositories.UserRepository;
import com.chessButBetter.chessButBetter.service.UserService;

import jakarta.persistence.EntityManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final OAuthTempUserRepository oauthTempUserRepository;

    @Autowired
    EntityManager entityManager;

    private final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    public UserServiceImpl(UserRepository userRepository, OAuthTempUserRepository oauthTempUserRepository) {
        this.userRepository = userRepository;
        this.oauthTempUserRepository = oauthTempUserRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User createUser(User user) {
        logger.info("Creating user: " + user.getUsername());

        // hash password
        String hashedPassword = new BCryptPasswordEncoder().encode(user.getPassword());
        user.setPassword(hashedPassword);

        return userRepository.saveNew(
                user.getId().getUserId(),
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getRole().name()) > 0 ? user : null;
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
        // return user;
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

    @Override
    public User loginOAuthUser(OAuthUserInfo userInfo) {
        logger.info("Logging in OAuth email: " + userInfo.getEmail());

        // Check if user already exists by email
        Optional<User> existingUser = userRepository.findByEmail(userInfo.getEmail());
        if (existingUser.isPresent()) {
            return existingUser.get(); // User already exists, return it
        }
        return null; // User does not exist, return null
    }

    @Override
    public OAuthTempUser registerOAuthUser(String provider, OAuthUserInfo userInfo) {
        logger.info("Registering OAuth user: " + userInfo.getEmail() + " from provider: " + provider);

        // Check if user already exists by email
        Optional<OAuthTempUser> existingUser = oauthTempUserRepository.findByEmail(userInfo.getEmail());
        if (existingUser.isPresent()) {
            return existingUser.get(); // User already exists, return it
        }

        // Create new user
        OAuthTempUser newUser = new OAuthTempUser();
        newUser.setId(new UserId());
        newUser.setEmail(userInfo.getEmail());
        newUser.setProvider(provider);

        return oauthTempUserRepository.save(newUser); // Save the new user
    }
}
