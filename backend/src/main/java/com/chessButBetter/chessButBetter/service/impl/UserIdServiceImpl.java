package com.chessButBetter.chessButBetter.service.impl;

import org.springframework.stereotype.Service;

import com.chessButBetter.chessButBetter.entity.UserId;
import com.chessButBetter.chessButBetter.repositories.UserIdRepository;
import com.chessButBetter.chessButBetter.service.UserIdService;

@Service
public class UserIdServiceImpl implements UserIdService {

    private final UserIdRepository userIdRepository;

    public UserIdServiceImpl(UserIdRepository userIdRepository) {
        this.userIdRepository = userIdRepository;
    }

    public UserId createUserId(UserId userId) {
        // if userId has a value, check if it exists in the database
        if (userId.getUserId() != null) {
            if (userIdRepository.existsById(userId.getUserId())) {
                return userId;
            }
        }
        // if userId does not exist, save it to the database
        return this.userIdRepository.save(userId);
    }

    public UserId createUserId() {
        return this.userIdRepository.save(new UserId());
    }
}
