package com.chessButBetter.chessButBetter.webSocket.send;

import java.util.List;

import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.DrawOfferDto;
import com.chessButBetter.chessButBetter.dto.GameDto;
import com.chessButBetter.chessButBetter.dto.GameEndReasonDto;
import com.chessButBetter.chessButBetter.dto.GameMessageDto;
import com.chessButBetter.chessButBetter.dto.GameWebSocketMessage;
import com.chessButBetter.chessButBetter.dto.MoveDto;
import com.chessButBetter.chessButBetter.dto.MoveErrorDto;
import com.chessButBetter.chessButBetter.dto.PlayerDto;
import com.chessButBetter.chessButBetter.dto.PlayerJoinedDto;
import com.chessButBetter.chessButBetter.entity.DrawOffer;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.GameMessage;
import com.chessButBetter.chessButBetter.entity.Move;
import com.chessButBetter.chessButBetter.enums.GameWebSocketMessageType;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.mapper.DrawOfferMapper;
import com.chessButBetter.chessButBetter.mapper.GameMapper;
import com.chessButBetter.chessButBetter.mapper.MoveErrorMapper;
import com.chessButBetter.chessButBetter.mapper.MoveMapper;
import com.chessButBetter.chessButBetter.mapper.PlayerMapper;
import com.chessButBetter.chessButBetter.webSocket.registry.SessionRegistry;

@Component
public class GameSender {

    private final SimpMessagingTemplate messagingTemplate;
    private final SessionRegistry sessionRegistry;

    public GameSender(@Lazy SimpMessagingTemplate messagingTemplate, SessionRegistry sessionRegistry) {
        this.messagingTemplate = messagingTemplate;
        this.sessionRegistry = sessionRegistry;
    }

    public void sendGameMove(Game game, Move move) {
        MoveDto moveDto = MoveMapper.fromEntity(move, MoveMapper.lastMoveTime(game, move.getId().getMoveNumber() - 1));
        GameDto gameDto = GameMapper.fromEntity(game, null, null, null);
        moveDto.setPlayer1TimeLeft(gameDto.getPlayer1TimeLeft());
        moveDto.setPlayer2TimeLeft(gameDto.getPlayer2TimeLeft());
        sendToGame(game, new GameWebSocketMessage(GameWebSocketMessageType.GAME_MOVE, moveDto));
    }

    public void sendMoveError(Game game, Move move) {
        MoveErrorDto moveErrorDto = MoveErrorMapper.fromEntity(move);
        sendToGame(game, new GameWebSocketMessage(GameWebSocketMessageType.MOVE_ERROR, moveErrorDto));
    }

    public void sendGameOver(Game game, GameEndReasonDto reason) {
        sendToGame(game, new GameWebSocketMessage(GameWebSocketMessageType.GAME_ENDED, reason));
    }

    public void sendDrawOffer(Game game, DrawOffer drawOffer) {
        DrawOfferDto drawOfferDto = DrawOfferMapper.fromEntity(drawOffer);
        sendToGame(game, new GameWebSocketMessage(GameWebSocketMessageType.DRAW_OFFER, drawOfferDto));
    }

    public void sendPlayerJoined(Game game, PlayerJoinedDto playerJoinedDto) {
        sendToGame(game, new GameWebSocketMessage(GameWebSocketMessageType.PLAYER_JOINED, playerJoinedDto));
    }

    public void sendPlayerLeft(Game game, AbstractUser user) {
        PlayerDto playerDto = PlayerMapper.fromEntity(user);
        sendToGame(game, new GameWebSocketMessage(GameWebSocketMessageType.PLAYER_LEFT, playerDto));
    }

    public void sendGameMessage(Game game, GameMessage gameMessage) {
        GameMessageDto gameMessageDto = new GameMessageDto(game.getId(), gameMessage.getContent(),
                gameMessage.getSenderId(), gameMessage.getTimestamp(), gameMessage.getIsPublic());
        if (gameMessage.getIsPublic()) {
            sendToGame(game, new GameWebSocketMessage(GameWebSocketMessageType.GAME_MESSAGE, gameMessageDto));
        } else {
            Long whitePlayerId = game.getPlayer1Id();
            Long blackPlayerId = game.getPlayer2Id();
            /*
             * if (gameMessage.getSenderId().getUserId().equals(whitePlayerId)) {
             * sendToUserInGame(game, game.getPlayer2(), new
             * GameWebSocketMessage(GameWebSocketMessageType.GAME_MESSAGE, gameMessageDto));
             * } else if (gameMessage.getSenderId().getUserId().equals(blackPlayerId)) {
             * sendToUserInGame(game, game.getPlayer1(), new
             * GameWebSocketMessage(GameWebSocketMessageType.GAME_MESSAGE, gameMessageDto));
             * }
             */
            sendToGame(game, new GameWebSocketMessage(GameWebSocketMessageType.GAME_MESSAGE, gameMessageDto));
        }
    }

    private void sendToGame(Game game, GameWebSocketMessage payload) {
        // Logic to send the payload to the game
        messagingTemplate.convertAndSend("/game/" + game.getId(), payload);
    }

    private void sendToUserInGame(Game game, AbstractUser user, GameWebSocketMessage payload) {
        List<String> sessionIds = sessionRegistry.getQueueSessions().getSessions(user.getId().getUserId());
        if (sessionIds.isEmpty()) {
        }
        for (String sessionId : sessionIds) {
            sendToGameUserSession(game, sessionId, payload);
        }
    }

    private void sendToGameUserSession(Game game, String sessionId, GameWebSocketMessage payload) {
        // Logic to send the payload to the game user session
        messagingTemplate.convertAndSendToUser(sessionId, "/game/" + game.getId(), payload);
    }
}
