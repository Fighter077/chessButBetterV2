package com.chessButBetter.chessButBetter.dto;

import com.chessButBetter.chessButBetter.entity.Game;

public class BoardDto {
    private char[][] board;

    public BoardDto() {
    }

    public BoardDto(char[][] board) {
        this.board = board;
    }

    public BoardDto(Game game) {
        char[][] inializedBoard = {
                { 'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R' },
                { 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P' },
                { ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' },
                { ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' },
                { ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' },
                { ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' },
                { 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p' },
                { 'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r' }
        };

        this.board = inializedBoard;

        for (int i = 0; i < game.getMoves().size(); i++) {
            String move = game.getMoves().get(i).getMove();
            this.makeMove(move);
        }
    }

    public char[][] getBoard() {
        return this.board;
    }

    public void setBoard(char[][] board) {
        this.board = board;
    }

    public char[][] makeMove(String move) {
        int fromRow = move.charAt(1) - '1';
        int fromCol = move.charAt(0) - 'a';
        int toRow = move.charAt(3) - '1';
        int toCol = move.charAt(2) - 'a';

        this.board[toRow][toCol] = this.board[fromRow][fromCol];
        this.board[fromRow][fromCol] = ' ';

        // Handle castling
        if (move.length() == 6 && move.charAt(4) == 'c') {
            if (move.charAt(5) == 's') {
                // King-side castling
                this.board[toRow][toCol - 1] = this.board[toRow][toCol + 1];
                this.board[toRow][toCol + 1] = ' ';
            } else if (move.charAt(5) == 'l') {
                // Queen-side castling
                this.board[toRow][toCol + 1] = this.board[toRow][toCol - 2];
                this.board[toRow][toCol - 2] = ' ';
            }
        }

        return board;
    }

    public char getPieceAt(char file, char rank) {
        int row = (rank - '1');
        int col = (file - 'a');
        return this.board[row][col];
    }

    public void setPieceAt(char file, char rank, char piece) {
        int row = rank - '1';
        int col = file - 'a';
        this.board[row][col] = piece;
    }

}
