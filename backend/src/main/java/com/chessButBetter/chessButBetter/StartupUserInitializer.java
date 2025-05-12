package com.chessButBetter.chessButBetter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.enums.RoleType;
import com.chessButBetter.chessButBetter.repositories.UserRepository;
import com.chessButBetter.chessButBetter.service.AbstractUserService;

import jakarta.annotation.PostConstruct;


@Component
public class StartupUserInitializer {

    private static final Logger logger = LoggerFactory.getLogger(StartupUserInitializer.class);
    
    private String adminUsername = "admin";
    private String adminEmail = "admin@chessbutbetter.com";

    @Value("${admin.password}")
    private String adminPassword;

    private final UserRepository userRepository;
    private final AbstractUserService abstractUserService;

    public StartupUserInitializer(UserRepository userRepository, AbstractUserService abstractUserService) {
        this.userRepository = userRepository;
        this.abstractUserService = abstractUserService;
    }

    @PostConstruct
    public void init() {
        logger.info("Checking for admin user in the database...");
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            logger.info("Admin user not found. Creating a new admin user...");
            User adminUser = new User();
            adminUser.setUsername(adminUsername);
            adminUser.setEmail(adminEmail);
            adminUser.setPassword(adminPassword);
            adminUser.setRole(RoleType.ADMIN);
            abstractUserService.registerUser(adminUser);
            logger.info("Admin user created successfully.");
        } else {
            logger.info("Admin user already exists. No action taken.");
        }
        logger.info("Admin user initialization complete.");
    }
}
