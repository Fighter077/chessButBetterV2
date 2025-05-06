package com.chessButBetter.chessButBetter.service;

import com.chessButBetter.chessButBetter.entity.User;

public interface QueueService {
    
    void findMatch(User user);

    void cancelMatch(User user);

}
