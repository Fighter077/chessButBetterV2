package com.chessButBetter.chessButBetter.webSocket.send;

import java.util.List;

import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.GameDto;
import com.chessButBetter.chessButBetter.dto.QueueWebSocketMessage;
import com.chessButBetter.chessButBetter.entity.DrawOffer;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.enums.QueueWebSocketMessageType;
import com.chessButBetter.chessButBetter.exception.UserNotFoundException;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.mapper.GameMapper;
import com.chessButBetter.chessButBetter.service.AbstractUserService;
import com.chessButBetter.chessButBetter.service.GameService;
import com.chessButBetter.chessButBetter.webSocket.registry.SessionRegistry;

@Component
public class QueueSender {

    private final SimpMessagingTemplate messagingTemplate;
    private final SessionRegistry sessionRegistry;
    private final AbstractUserService abstractUserService;
    private final GameService gameService;

    public QueueSender(@Lazy SimpMessagingTemplate messagingTemplate,
            SessionRegistry sessionRegistry, AbstractUserService abstractUserService,
            GameService gameService) {
        this.messagingTemplate = messagingTemplate;
        this.sessionRegistry = sessionRegistry;
        this.abstractUserService = abstractUserService;
        this.gameService = gameService;
    }

    public void sendGameStart(AbstractUser user, Game game) {
        AbstractUser player1 = abstractUserService.getUserById(game.getPlayer1Id()).orElseThrow(() -> new UserNotFoundException(game.getPlayer1Id()));
        AbstractUser player2 = abstractUserService.getUserById(game.getPlayer2Id()).orElseThrow(() -> new UserNotFoundException(game.getPlayer2Id()));
        DrawOffer drawOffer = gameService.getDrawOffer(game.getId()).orElse(null);
        GameDto gameDto = GameMapper.fromEntity(game, player1, player2, drawOffer);
        sendToUser(user, new QueueWebSocketMessage(QueueWebSocketMessageType.MATCH_FOUND, gameDto));
    }

    private void sendToUser(AbstractUser user, QueueWebSocketMessage payload) {
        List<String> sessionIds = sessionRegistry.getQueueSessions().getSessions(user.getId().getUserId());
        if (sessionIds.isEmpty()) {
        }
        for (String sessionId : sessionIds) {
            sendToUserSession(sessionId, payload);
        }
    }

    private void sendToUserSession(String sessionId, QueueWebSocketMessage payload) {
        messagingTemplate.convertAndSendToUser(sessionId, "/queue", payload);
    }

}
