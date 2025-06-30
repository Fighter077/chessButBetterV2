package com.chessButBetter.chessButBetter.service.impl;

import com.chessButBetter.chessButBetter.entity.TempUser;
import com.chessButBetter.chessButBetter.entity.UserId;
import com.chessButBetter.chessButBetter.repositories.TempUserRepository;
import com.chessButBetter.chessButBetter.service.TempUserService;
import com.chessButBetter.chessButBetter.service.UserService;
import com.github.javafaker.Faker;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class TempUserServiceImpl implements TempUserService {

    private final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final TempUserRepository tempUserRepository;

    public TempUserServiceImpl(TempUserRepository tempUserRepository, UserService userService) {
        this.tempUserRepository = tempUserRepository;
    }

    @Override
    // Precondition: user does not exist already with the same username
    public TempUser createUser() {
        Faker faker = new Faker();

        String username = null;
        while (tempUserRepository.existsByUsername(username) || username == null) {
            username = toProperCase(faker.superhero().prefix()) + toProperCase(faker.animal().name()); // Generate a new
                                                                                                       // random
                                                                                                       // username
        }
        TempUser user = new TempUser(new UserId(), username);
        logger.info("Creating user: " + user.getUsername());
        return tempUserRepository.save(user);
    }

    @Override
    public Optional<TempUser> getUserByUsername(String username) {
        return tempUserRepository.findByUsername(username);
    }

    @Override
    public Optional<TempUser> getUserById(Long id) {
        return tempUserRepository.findById(id);
    }

    @Override
    public TempUser deleteUser(Long id) {
        Optional<TempUser> user = tempUserRepository.findById(id);
        if (user.isPresent()) {
            tempUserRepository.deleteByIdUserOnly(id);
            return user.get();
        }
        return null;
    }

    private String toProperCase(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

}
