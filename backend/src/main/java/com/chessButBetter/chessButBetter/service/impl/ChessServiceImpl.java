package com.chessButBetter.chessButBetter.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.chessButBetter.chessButBetter.connectors.StockFishEngine;
import com.chessButBetter.chessButBetter.service.ChessService;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
public class ChessServiceImpl implements ChessService {

    @Value("${stockfish.path}")
    private String stockfishPath;

    @Value("${stockfish.movetime}")
    private int movetime;

    private final StockFishEngine stockFishEngine;

    private final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    public ChessServiceImpl(StockFishEngine stockFishEngine) {
        this.stockFishEngine = stockFishEngine;
    }

    @PostConstruct
    public void init() {
        if (!stockFishEngine.start(stockfishPath)) {
            throw new RuntimeException("Failed to start StockFish engine");
        }
        logger.info("StockFish engine started successfully");
    }

    @Override
    public String getBestMove(String position) throws Exception {
        return extractBestMove(stockFishEngine.getBestMove(position, movetime));
    }

    private String extractBestMove(String output) {
        String[] lines = output.split("\n");
        for (String line : lines) {
            if (line.startsWith("bestmove")) {
                String[] parts = line.split(" ");
                if (parts.length >= 2) {
                    return parts[1]; // This is the move, e.g., "e7e5"
                }
            }
        }
        return null;
    }

    @Override
    @PreDestroy
    public void shutdown() throws Exception {
        stockFishEngine.stop();
        logger.info("StockFish engine stopped");
    }
}
