package com.chessButBetter.chessButBetter.endpoint;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
@RequestMapping(value = "/api/game")
public class GameEndpoint {

    private final SecurityAspect securityAspect;
    private final GameService gameService;
    private final AbstractUserService abstractUserService;

    public GameEndpoint(SecurityAspect securityAspect, GameService gameService,
            AbstractUserService abstractUserService) {
        this.securityAspect = securityAspect;
        this.gameService = gameService;
        this.abstractUserService = abstractUserService;
    }

    @TempAccess
    @GetMapping("/active")
    public List<GameDto> findGame() {
        AbstractUser user = securityAspect.getVerifiedUserFromSession();
        // if user has an active game, return it
        List<Game> activeGame = gameService.getActiveGame(user);

        return activeGame.stream()
                .map(game -> {
                    AbstractUser player1 = abstractUserService.getUserById(game.getPlayer1Id())
                            .orElseThrow(() -> new UserNotFoundException(game.getPlayer1Id()));
                    AbstractUser player2 = abstractUserService.getUserById(game.getPlayer2Id())
                            .orElseThrow(() -> new UserNotFoundException(game.getPlayer2Id()));
                    return GameMapper.fromEntity(game, player1, player2);
                })
                .toList();
    }

    @GetMapping("/{gameId}")
    public GameDto getGameById(@PathVariable Long gameId) {
        Optional<Game> game = gameService.getGameById(gameId);
        if (game.isPresent()) {
            // convert game to gameDto
            Game g = game.get();
            // get player1 and player2
            AbstractUser player1 = abstractUserService.getUserById(g.getPlayer1Id())
                    .orElseThrow(() -> new UserNotFoundException(g.getPlayer1Id()));
            AbstractUser player2 = abstractUserService.getUserById(g.getPlayer2Id())
                    .orElseThrow(() -> new UserNotFoundException(g.getPlayer2Id()));
            return GameMapper.fromEntity(g, player1, player2);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found.");
    }
}
