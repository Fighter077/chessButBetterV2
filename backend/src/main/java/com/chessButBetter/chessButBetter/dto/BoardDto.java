package com.chessButBetter.chessButBetter.dto;

import com.chessButBetter.chessButBetter.entity.Game;

public class BoardDto {
    private char[][] board;
    private String enPassantField;

    public BoardDto() {
    }

    public BoardDto(char[][] board) {
        this.board = board;
        this.enPassantField = ""; // Initialize enPassantField as empty
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
        this.enPassantField = ""; // Initialize enPassantField as empty

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

        char movedPiece = this.board[toRow][toCol];

        // Check if en passant happened
        if (Character.toLowerCase(movedPiece) == 'p') {
            if (this.enPassantField.length() == 2 && move.charAt(2) == this.enPassantField.charAt(0) && move.charAt(3) == this.enPassantField.charAt(1)) {
                // Perform en passant capture
                if (movedPiece == 'P') {
                    // White pawn captures black pawn
                    this.board[toRow - 1][toCol] = ' ';
                } else {
                    // Black pawn captures white pawn
                    this.board[toRow + 1][toCol] = ' ';
                }
            }
        }

        // Check for en passant possibility
        if (this.board[toRow][toCol] == 'P' && fromRow == 1 && toRow == 3) {
            // If a white pawn moves two squares forward, it can be captured en passant
            this.enPassantField = (char) ('a' + toCol) + "" + (char) ('1' + toRow - 1);
        } else if (this.board[toRow][toCol] == 'p' && fromRow == 6 && toRow == 4) {
            // If a black pawn moves two squares forward, it can be captured en passant
            this.enPassantField = (char) ('a' + toCol) + "" + (char) ('1' + toRow + 1);
        } else {
            this.enPassantField = ""; // Reset en passant field if not applicable
        }

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

        // Handle promotion
        if (move.length() == 5) {
            char promotionPiece = move.charAt(4);
            if (Character.toLowerCase(movedPiece) == 'p') {
                // Replace the pawn with the promoted piece
                this.board[toRow][toCol] = promotionPiece;
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

    public String getEnPassantField() {
        return enPassantField;
    }

    public void setEnPassantField(String enPassantField) {
        this.enPassantField = enPassantField;
    }

}