package com.chessButBetter.chessButBetter.webSocket.send;

import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.chessButBetter.chessButBetter.dto.DrawOfferDto;
import com.chessButBetter.chessButBetter.dto.GameDto;
import com.chessButBetter.chessButBetter.dto.GameEndReasonDto;
import com.chessButBetter.chessButBetter.dto.GameWebSocketMessage;
import com.chessButBetter.chessButBetter.dto.MoveDto;
import com.chessButBetter.chessButBetter.dto.MoveErrorDto;
import com.chessButBetter.chessButBetter.dto.PlayerDto;
import com.chessButBetter.chessButBetter.dto.PlayerJoinedDto;
import com.chessButBetter.chessButBetter.entity.DrawOffer;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.Move;
import com.chessButBetter.chessButBetter.enums.GameWebSocketMessageType;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.mapper.DrawOfferMapper;
import com.chessButBetter.chessButBetter.mapper.GameMapper;
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
    
    private void sendToGame(Game game, GameWebSocketMessage payload) {
        // Logic to send the payload to the game
        messagingTemplate.convertAndSend("/game/" + game.getId(), payload);
    }
}
