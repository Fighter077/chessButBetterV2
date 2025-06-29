package com.chessButBetter.chessButBetter.service;

import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

public interface QueueService {
    
    void findMatch(AbstractUser user, Integer start, Integer increment);

    void cancelMatch(AbstractUser user);

}
