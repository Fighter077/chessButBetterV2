package com.chessButBetter.chessButBetter.service.impl;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.chessButBetter.chessButBetter.dto.DemoGameDto;
import com.chessButBetter.chessButBetter.dto.MoveDto;
import com.chessButBetter.chessButBetter.dto.PlayerDto;
import com.chessButBetter.chessButBetter.service.DemoGameService;

@Service
public class DemoGameServiceImpl implements DemoGameService {

    @Value("${demoGames.path}")
    private String demoGamesPath;

    private final Random random = new Random();

    private List<Path> getAllDemoGames() {
        try {
            // List all .uci files in the directory
            List<Path> uciFiles = Files.list(Paths.get(demoGamesPath))
                    .filter(path -> path.toString().endsWith(".uci"))
                    .collect(Collectors.toList());

            if (uciFiles.isEmpty()) {
                throw new RuntimeException("No demo games found in path: " + demoGamesPath);
            }
            return uciFiles;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read demo games from path: " + demoGamesPath, e);
        }
    }

    private DemoGameDto getRandomGame(List<Path> demoGames) {
        // Select a random demo game file
        Path randomGamePath = demoGames.get(random.nextInt(demoGames.size()));

        return parseGameFile(randomGamePath);
    }

    private DemoGameDto parseGameFile(Path gamePath) {
        List<String> lines;
        try {
            lines = Files.readAllLines(gamePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read demo game file: " + gamePath, e);
        }

        if (lines.size() < 5) {
            throw new IllegalArgumentException("Invalid UCI file format: " + gamePath.getFileName());
        }

        String event = lines.get(0).trim();
        String dateStr = lines.get(1).trim();
        String player1Name = lines.get(2).trim();
        String player2Name = lines.get(3).trim();

        PlayerDto player1 = new PlayerDto(1L, player1Name);
        PlayerDto player2 = new PlayerDto(2L, player2Name);

        // All remaining lines except the last are moves
        List<String> moveLines = lines.subList(5, lines.size());
        List<MoveDto> moves = new ArrayList<>();

        for (int i = 0; i < moveLines.size(); i++) {
            String move = moveLines.get(i).trim();
            if (!move.isEmpty()) {
                moves.add(new MoveDto(move, i));
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        LocalDate date = LocalDate.parse(dateStr, formatter);

        return new DemoGameDto(
                0L,
                player1,
                player2,
                null,
                moves,
                date.atStartOfDay(),
                event);
    }

    @Override
    public DemoGameDto getRandomDemoGame() {
        List<Path> demoGames = getAllDemoGames();
        return getRandomGame(demoGames);
    }
}
