package com.chessButBetter.chessButBetter.endpoint;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.chessButBetter.chessButBetter.dto.GameDto;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.mapper.GameMapper;
import com.chessButBetter.chessButBetter.security.SecurityAspect;
import com.chessButBetter.chessButBetter.security.UserOnly;
import com.chessButBetter.chessButBetter.service.GameService;

@RestController
@RequestMapping(value = "/api/games")
public class GameEndpoint {

    private final SecurityAspect securityAspect;
    private final GameService gameService;

    public GameEndpoint(SecurityAspect securityAspect, GameService gameService) {
        this.securityAspect = securityAspect;
        this.gameService = gameService;
    }

    @UserOnly
    @GetMapping("/active")
    public GameDto findGame() {
        User user = securityAspect.getVerifiedUserFromSession();
        //if user has an active game, return it
        Optional<Game> activeGame = gameService.getActiveGame(user);
        if (activeGame.isPresent()) {
            //convert game to gameDto
            Game game = activeGame.get();
            return GameMapper.fromEntity(game);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User does not have an active game.");
    }
}
