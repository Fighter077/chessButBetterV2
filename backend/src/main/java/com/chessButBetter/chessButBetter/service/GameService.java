package com.chessButBetter.chessButBetter.service;

import java.util.List;
import java.util.Optional;

import com.chessButBetter.chessButBetter.dto.GameDto;
import com.chessButBetter.chessButBetter.entity.DrawOffer;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.Move;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

public interface GameService {
    
    List<Game> getActiveGame(AbstractUser user);

    Game createGame (AbstractUser player1, AbstractUser player2, Integer start, Integer increment);

    Game endGame (Game game, String result);

    Optional<Game> getGameById (Long gameId);

    GameDto getGameState (Long gameId);

    void move (AbstractUser user, Game game, String move);

    void resign (AbstractUser user, Game game);

    Move getBestMove (Game game);

    DrawOffer offerDraw (Game game, AbstractUser user);

    void cancelDraw (Game game, AbstractUser user);

    void acceptDraw (Game game, AbstractUser user);

    Optional<DrawOffer> getDrawOffer (Long gameId);

    void checkTimeout (Game game);
}
