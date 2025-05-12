package com.chessButBetter.chessButBetter.webSocket.send;

import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.GameWebSocketMessage;
import com.chessButBetter.chessButBetter.dto.MoveDto;
import com.chessButBetter.chessButBetter.dto.MoveErrorDto;
import com.chessButBetter.chessButBetter.dto.PlayerDto;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.Move;
import com.chessButBetter.chessButBetter.enums.GameWebSocketMessageType;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.mapper.MoveErrorMapper;
import com.chessButBetter.chessButBetter.mapper.MoveMapper;
import com.chessButBetter.chessButBetter.mapper.PlayerMapper;

@Component
public class GameSender {

    private final SimpMessagingTemplate messagingTemplate;

    public GameSender(@Lazy SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendGameMove(Game game, Move move) {
        MoveDto moveDto = MoveMapper.fromEntity(move);
        sendToGame(game, new GameWebSocketMessage(GameWebSocketMessageType.GAME_MOVE, moveDto));
    }

    public void sendMoveError(Game game, Move move) {
        MoveErrorDto moveErrorDto = MoveErrorMapper.fromEntity(move);
        sendToGame(game, new GameWebSocketMessage(GameWebSocketMessageType.MOVE_ERROR, moveErrorDto));
    }

    public void sendPlayerJoined(Game game, AbstractUser user) {
        PlayerDto playerDto = PlayerMapper.fromEntity(user);
        sendToGame(game, new GameWebSocketMessage(GameWebSocketMessageType.PLAYER_JOINED, playerDto));
    }

    public void sendPlayerLeft(Game game, AbstractUser user) {
        PlayerDto playerDto = PlayerMapper.fromEntity(user);
        sendToGame(game, new GameWebSocketMessage(GameWebSocketMessageType.PLAYER_LEFT, playerDto));
    }
    
    private void sendToGame(Game game, GameWebSocketMessage payload) {
        // Logic to send the payload to the game
        messagingTemplate.convertAndSend("/game/" + game.getId(), payload);
    }
}
