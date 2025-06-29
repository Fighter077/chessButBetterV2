package com.chessButBetter.chessButBetter.webSocket.listener;

import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.service.QueueService;

@Component
public class QueueListener {

    private final QueueService queueService;

    public QueueListener(QueueService queueService) {
        this.queueService = queueService;
    }

    public void lookForMatch(AbstractUser user, Integer start, Integer increment) {
        // Call the queue service to look for a match
        queueService.findMatch(user, start, increment);
    }

    public void cancelMatch(AbstractUser user) {
        // Call the queue service to cancel the match
        queueService.cancelMatch(user);
    }
}