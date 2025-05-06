package com.chessButBetter.chessButBetter.service;

import java.util.Optional;

import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.User;

public interface GameService {
    
    Optional<Game> getActiveGame(User user);

    Game createGame (User player1, User player2);

    Game getGameById (Long gameId);

    void move (User user, Game game, String move);
}
