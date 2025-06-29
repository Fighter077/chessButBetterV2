package com.chessButBetter.chessButBetter.webSocket.controller;

import java.security.Principal;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.chessButBetter.chessButBetter.dto.GameTimeOption;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.service.AbstractUserService;
import com.chessButBetter.chessButBetter.webSocket.listener.QueueListener;
import com.chessButBetter.chessButBetter.webSocket.registry.SessionRegistry;

@Controller
public class QueueController {

    private static final Logger logger = LoggerFactory.getLogger(QueueController.class);
    private final SessionRegistry sessionRegistry;
    private final AbstractUserService abstractUserService;
    private final QueueListener queueListener;

    @Autowired
    public QueueController(SessionRegistry sessionRegistry, AbstractUserService abstractUserService, QueueListener queueListener) {
        this.sessionRegistry = sessionRegistry;
        this.abstractUserService = abstractUserService;
        this.queueListener = queueListener;
    }

    @MessageMapping("/queue/join")
    public void handleJoinQueue(@Payload GameTimeOption gameTimeOption, Principal principal) {
        // Check if the user is authenticated
        if (principal == null) {
            logger.warn("User is not authenticated");
            return;
        }
        Long userId = this.sessionRegistry.getQueueSessions().getUserId(principal.getName());
        if (userId == null) {
            logger.warn("User ID not found for principal: " + principal.getName());
            return;
        }
        Optional<AbstractUser> optionalUser = this.abstractUserService.getUserById(userId);
        if (optionalUser.isPresent()) {
            AbstractUser user = optionalUser.get();
            logger.info("User " + user.getUsername() + " joined the queue");
            queueListener.lookForMatch(user, gameTimeOption.getStart(), gameTimeOption.getIncrement());
        } else {
            logger.warn("User not found for principal: " + principal.getName());
        }
    }

}
