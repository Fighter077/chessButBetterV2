package com.chessButBetter.chessButBetter.service;

import java.util.Optional;

import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

public interface GameService {
    
    Optional<Game> getActiveGame(AbstractUser user);

    Game createGame (AbstractUser player1, AbstractUser player2);

    Game getGameById (Long gameId);

    void move (AbstractUser user, Game game, String move);
}
