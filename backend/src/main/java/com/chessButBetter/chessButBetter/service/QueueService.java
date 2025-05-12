package com.chessButBetter.chessButBetter.service;

import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

public interface QueueService {
    
    void findMatch(AbstractUser user);

    void cancelMatch(AbstractUser user);

}
