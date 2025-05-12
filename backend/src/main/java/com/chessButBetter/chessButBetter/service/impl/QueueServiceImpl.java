package com.chessButBetter.chessButBetter.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.QueueEntry;
import com.chessButBetter.chessButBetter.exception.UserNotFoundException;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.repositories.QueueRepository;
import com.chessButBetter.chessButBetter.service.AbstractUserService;
import com.chessButBetter.chessButBetter.service.GameService;
import com.chessButBetter.chessButBetter.service.QueueService;
import com.chessButBetter.chessButBetter.webSocket.send.QueueSender;

@Service
public class QueueServiceImpl implements QueueService {

    private final GameService gameService;
    private final QueueRepository queueRepository;
    private final QueueSender queueSender;
    private final AbstractUserService abstractUserService;

    public QueueServiceImpl(
            GameService gameService, QueueRepository queueRepository, QueueSender queueSender, AbstractUserService abstractUserService) {
        this.gameService = gameService;
        this.queueRepository = queueRepository;
        this.queueSender = queueSender;
        this.abstractUserService = abstractUserService;
    }

    @Override
    public void findMatch(AbstractUser user) {
        // Check if the user is already in the queue
        if (queueRepository.existsByUserId(user.getId())) {
            // User is already in the queue, no action needed
            return;
        }
        Optional<QueueEntry> matchedUser = queueRepository.findTopBy();
        if (matchedUser.isPresent()) {
            Long matchedUserId = matchedUser.get().getUserId().getUserId();
            AbstractUser opponent = this.abstractUserService.getUserById(matchedUserId).orElseThrow(() -> new UserNotFoundException(matchedUserId));
            // Logic to create a game between the user and the matched opponent
            Game createdGame = gameService.createGame(user, opponent);
            // Remove both users from the queue
            queueRepository.delete(matchedUser.get());
            queueRepository.delete(new QueueEntry(user));

            // Notify both users about the game creation
            queueSender.sendGameStart(user, createdGame);
            queueSender.sendGameStart(opponent, createdGame);
        } else {
            // Add the user to the queue if no match is found
            QueueEntry queueEntry = new QueueEntry(user);
            queueRepository.save(queueEntry);
        }
    }

    @Override
    public void cancelMatch(AbstractUser user) {
        // Check if the user is in the queue
        Optional<QueueEntry> queueEntry = queueRepository.findByUserId(user.getId());
        if (queueEntry.isPresent()) {
            // Remove the user from the queue
            queueRepository.delete(queueEntry.get());
        }
    }
}
