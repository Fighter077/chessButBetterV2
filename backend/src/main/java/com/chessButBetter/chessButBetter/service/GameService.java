package com.chessButBetter.chessButBetter.service;

import java.util.List;
import java.util.Optional;

import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

public interface GameService {
    
    List<Game> getActiveGame(AbstractUser user);

    Game createGame (AbstractUser player1, AbstractUser player2);

    Game endGame (Game game, String result);

    Optional<Game> getGameById (Long gameId);

    void move (AbstractUser user, Game game, String move);

    void resign (AbstractUser user, Game game);
}
