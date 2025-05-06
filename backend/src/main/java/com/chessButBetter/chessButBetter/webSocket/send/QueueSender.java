package com.chessButBetter.chessButBetter.webSocket.send;

import java.util.List;

import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.GameDto;
import com.chessButBetter.chessButBetter.dto.QueueWebSocketMessage;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.enums.QueueWebSocketMessageType;
import com.chessButBetter.chessButBetter.mapper.GameMapper;
import com.chessButBetter.chessButBetter.webSocket.registry.SessionRegistry;

@Component
public class QueueSender {

    private final SimpMessagingTemplate messagingTemplate;
    private final SessionRegistry sessionRegistry;

    public QueueSender(@Lazy SimpMessagingTemplate messagingTemplate,
            SessionRegistry sessionRegistry) {
        this.messagingTemplate = messagingTemplate;
        this.sessionRegistry = sessionRegistry;
    }

    public void sendGameStart(User user, Game game) {
        GameDto gameDto = GameMapper.fromEntity(game);
        sendToUser(user, new QueueWebSocketMessage(QueueWebSocketMessageType.MATCH_FOUND, gameDto));
    }

    private void sendToUser(User user, QueueWebSocketMessage payload) {
        List<String> sessionIds = sessionRegistry.getQueueSessions().getSessions(user.getId());
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
