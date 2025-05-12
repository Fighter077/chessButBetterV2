package com.chessButBetter.chessButBetter.endpoint;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.chessButBetter.chessButBetter.dto.GameDto;
import com.chessButBetter.chessButBetter.entity.Game;
import com.chessButBetter.chessButBetter.exception.UserNotFoundException;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;
import com.chessButBetter.chessButBetter.mapper.GameMapper;
import com.chessButBetter.chessButBetter.security.SecurityAspect;
import com.chessButBetter.chessButBetter.security.TempAccess;
import com.chessButBetter.chessButBetter.service.AbstractUserService;
import com.chessButBetter.chessButBetter.service.GameService;

@RestController
@RequestMapping(value = "/api/games")
public class GameEndpoint {

    private final SecurityAspect securityAspect;
    private final GameService gameService;
    private final AbstractUserService abstractUserService;

    public GameEndpoint(SecurityAspect securityAspect, GameService gameService, AbstractUserService abstractUserService) {
        this.securityAspect = securityAspect;
        this.gameService = gameService;
        this.abstractUserService = abstractUserService;
    }

    @TempAccess
    @GetMapping("/active")
    public GameDto findGame() {
        AbstractUser user = securityAspect.getVerifiedUserFromSession();
        //if user has an active game, return it
        Optional<Game> activeGame = gameService.getActiveGame(user);
        if (activeGame.isPresent()) {
            //convert game to gameDto
            Game game = activeGame.get();
            //get player1 and player2
            AbstractUser player1 = abstractUserService.getUserById(game.getPlayer1Id()).orElseThrow(() -> new UserNotFoundException(game.getPlayer1Id()));
            AbstractUser player2 = abstractUserService.getUserById(game.getPlayer2Id()).orElseThrow(() -> new UserNotFoundException(game.getPlayer2Id()));
            return GameMapper.fromEntity(game, player1, player2);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User does not have an active game.");
    }
}
