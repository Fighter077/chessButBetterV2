package com.chessButBetter.chessButBetter.service;

public interface ChessService {
    public String getBestMove(String position) throws Exception;

    public void shutdown() throws Exception;
}
