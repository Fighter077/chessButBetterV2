import { Field, Piece } from "../../../../../interfaces/game";

export class MoveCalculator {
    static getPossibleMoves(piece: Piece, field: Field[][], all = false): Field[] {
        const moves: Field[] = [];

        // Calculate possible moves based on piece type and position
        switch (piece.type.toLowerCase()) {
            case 'p':
                this.getPawnMoves(piece, moves, field, all);
                break;
            case 'r':
                this.getRookMoves(piece, moves, field, all);
                break;
            case 'n':
                this.getKnightMoves(piece, moves, field, all);
                break;
            case 'b':
                this.getBishopMoves(piece, moves, field, all);
                break;
            case 'q':
                this.getQueenMoves(piece, moves, field, all);
                break;
            case 'k':
                this.getKingMoves(piece, moves, field, all);
                break;
        }

        return moves;
    }

    private static getPawnMoves(piece: Piece, moves: Field[], field: Field[][], all: boolean = false): void {
        // Add logic to calculate pawn moves
        // move one step forward
        const forwardMove: Field = { row: piece.row + (piece.isWhite ? 1 : -1), column: piece.column, piece: null };
        moves.push(forwardMove);

        if (piece.isWhite && piece.row === 1) {
            // Add logic for initial double move
            const doubleMove: Field = { row: piece.row + 2, column: piece.column, piece: null };
            moves.push(doubleMove);
        }
        if (!piece.isWhite && piece.row === 6) {
            // Add logic for initial double move
            const doubleMove: Field = { row: piece.row - 2, column: piece.column, piece: null };
            moves.push(doubleMove);
        }

        // Add logic for capturing opponent pieces diagonally
        const leftCapture: Field = { row: piece.row + (piece.isWhite ? 1 : -1), column: piece.column - 1, piece: null };
        const rightCapture: Field = { row: piece.row + (piece.isWhite ? 1 : -1), column: piece.column + 1, piece: null };
        if (this.isOpponentPiece(piece, field[leftCapture.row][leftCapture.column]) || all) {
            if (!this.isOutOfBounds(leftCapture)) {
                moves.push(leftCapture);
            }
        }
        if (this.isOpponentPiece(piece, field[rightCapture.row][rightCapture.column]) || all) {
            if (!this.isOutOfBounds(rightCapture)) {
                moves.push(rightCapture);
            }
        }
    }

    private static getRookMoves(piece: Piece, moves: Field[], field: Field[][], all: boolean = false): void {
        // Calculate rook moves in all four directions
        const directions = [
            { row: 0, column: 1 },  // Right
            { row: 1, column: 0 },  // Down
            { row: 0, column: -1 }, // Left
            { row: -1, column: 0 }  // Up
        ];

        for (const direction of directions) {
            let row = piece.row;
            let column = piece.column;
            while (true) {
                row += direction.row;
                column += direction.column;
                if (this.isOutOfBounds({ column: column, row: row, piece: null })) break; // Stop if out of bounds
                const targetField = field[row][column];
                if (targetField.piece && !all) {
                    if (this.isOpponentPiece(piece, targetField)) {
                        moves.push(targetField); // Capture opponent piece
                    }
                    break; // Stop if a piece is encountered
                }
                moves.push(targetField); // Add empty field
            }
        }
    }

    private static getKnightMoves(piece: Piece, moves: Field[], field: Field[][], all: boolean = false): void {
        // Calculate knight moves in L-shape
        const knightMoves = [
            { row: 2, column: 1 },
            { row: 2, column: -1 },
            { row: -2, column: 1 },
            { row: -2, column: -1 },
            { row: 1, column: 2 },
            { row: 1, column: -2 },
            { row: -1, column: 2 },
            { row: -1, column: -2 }
        ];

        for (const move of knightMoves) {
            let targetField: Field = { row: piece.row + move.row, column: piece.column + move.column, piece: null };
            if (!this.isOutOfBounds(targetField)) {
                targetField = field[piece.row + move.row][piece.column + move.column];
                if (this.isOpponentPiece(piece, targetField) || !targetField.piece || all) {
                    moves.push(targetField); // Add knight move
                }
            }
        }
    }

    private static getBishopMoves(piece: Piece, moves: Field[], field: Field[][], all: boolean = false): void {
        // Calculate bishop moves in all four diagonal directions
        const directions = [
            { row: 1, column: 1 },   // Down-Right
            { row: 1, column: -1 },  // Down-Left
            { row: -1, column: 1 },  // Up-Right
            { row: -1, column: -1 }  // Up-Left
        ];

        for (const direction of directions) {
            let row = piece.row;
            let column = piece.column;
            while (true) {
                row += direction.row;
                column += direction.column;
                if (this.isOutOfBounds({ column: column, row: row, piece: null })) break; // Stop if out of bounds
                const targetField = field[row][column];
                if (targetField.piece && !all) {
                    if (this.isOpponentPiece(piece, targetField)) {
                        moves.push(targetField); // Capture opponent piece
                    }
                    break; // Stop if a piece is encountered
                }
                moves.push(targetField); // Add empty field
            }
        }
    }

    private static getQueenMoves(piece: Piece, moves: Field[], field: Field[][], all: boolean = false): void {
        // Calculate queen moves (rook + bishop)
        this.getRookMoves(piece, moves, field, all);
        this.getBishopMoves(piece, moves, field, all);
    }

    private static getKingMoves(piece: Piece, moves: Field[], field: Field[][], all: boolean = false): void {
        // Calculate king moves in all directions
        const kingMoves = [
            { row: 1, column: 0 },   // Down
            { row: -1, column: 0 },  // Up
            { row: 0, column: 1 },   // Right
            { row: 0, column: -1 },  // Left
            { row: 1, column: 1 },   // Down-Right
            { row: -1, column: -1 }, // Up-Left
            { row: -1, column: 1 },  // Up-Right
            { row: 1, column: -1 }   // Down-Left
        ];

        for (const move of kingMoves) {
            let targetField: Field = { row: piece.row + move.row, column: piece.column + move.column, piece: null };
            if (!this.isOutOfBounds(targetField)) {
                targetField = field[piece.row + move.row][piece.column + move.column];
                if (this.isOpponentPiece(piece, targetField) || !targetField.piece || all) {
                    moves.push(targetField); // Add king move
                }
            }
        }
    }

    private static isOutOfBounds(field: Field): boolean {
        // Check if the field is out of bounds (0-7 for both row and column)
        return field.row < 0 || field.row > 7 || field.column < 0 || field.column > 7;
    }

    private static isOpponentPiece(piece: Piece, field: Field): boolean {
        // Check if the field contains an opponent's piece
        return !this.isOutOfBounds && (!!field.piece) && field.piece.isWhite !== piece.isWhite;
    }
}