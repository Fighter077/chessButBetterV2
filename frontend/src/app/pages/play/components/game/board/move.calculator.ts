import { Field, Move, Piece } from "../../../../../interfaces/game";

export class MoveCalculator {
    static getPossibleMoves(piece: Piece, field: Field[][], moveHistory: string[], all = false, checkCastling = true): Field[] {
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
                if (checkCastling) {
                    this.getCastlingMoves(piece, moves, field, moveHistory, all);
                }
                break;
        }

        if (all) {
            return moves; // Return all possible moves
        }

        // Filter moves to remove those that would leave the king in check
        const validMoves: Field[] = [];
        for (const move of moves) {
            const boardCopy: Field[][] = JSON.parse(JSON.stringify(field)); // Create a deep copy of the board
            boardCopy[piece.row][piece.column].piece = null; // Remove the piece from its current position
            boardCopy[move.row][move.column].piece = piece; // Move the piece to the new position
            if (!checkCastling || !this.isKingInCheck(boardCopy, piece.isWhite)) {
                validMoves.push(move); // Add valid move
            }
        }

        return validMoves;
    }

    private static getPawnMoves(piece: Piece, moves: Field[], field: Field[][], all: boolean = false): void {
        // Add logic to calculate pawn moves
        // move one step forward
        const forwardMove: Field = { row: piece.row + (piece.isWhite ? 1 : -1), column: piece.column, piece: null };
        let firstMovePushed: boolean = false;
        if (!this.isOutOfBounds(forwardMove) && (!field[forwardMove.row][forwardMove.column].piece || all)) {
            moves.push(forwardMove);
            firstMovePushed = true;
        }

        if (piece.isWhite && piece.row === 1 && firstMovePushed) {
            // Add logic for initial double move
            const doubleMove: Field = { row: piece.row + 2, column: piece.column, piece: null };
            if (!this.isOutOfBounds(doubleMove) && (!field[doubleMove.row][doubleMove.column].piece || all)) {
                moves.push(doubleMove);
            }
        }
        if (!piece.isWhite && piece.row === 6 && firstMovePushed) {
            // Add logic for initial double move
            const doubleMove: Field = { row: piece.row - 2, column: piece.column, piece: null };
            if (!this.isOutOfBounds(doubleMove) && (!field[doubleMove.row][doubleMove.column].piece || all)) {
                moves.push(doubleMove);
            }
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
        return !field || field.row < 0 || field.row > 7 || field.column < 0 || field.column > 7;
    }

    private static isOpponentPiece(piece: Piece, field: Field): boolean {
        return !this.isOutOfBounds(field) && (field.piece !== null && field.piece.isWhite !== piece.isWhite);
    }

    private static hasPieceMoved(piece: Piece, moveHistory: string[]): boolean {
        const pieceCol = String.fromCharCode(piece.column + 'a'.charCodeAt(0));
        const pieceRow = (1 + piece.row).toString();
        // Check if the piece has moved based on the move history
        return moveHistory.some(move => move.charAt(2) === pieceCol && move.charAt(3) === pieceRow);
    }

    private static isValidMove(piece: Piece, move: Field, field: Field[][]): boolean {
        // Check if the move is valid based on the piece type and position
        const possibleMoves = this.getPossibleMoves(piece, field, [], false, false);
        return possibleMoves.some(possibleMove => possibleMove.row === move.row && possibleMove.column === move.column);
    }

    private static isKingInCheck(field: Field[][], isWhite: boolean | null = null): boolean {
        // Find the king's position
        let kingPosition: Field | null = null;
        for (let row = 0; row < field.length; row++) {
            for (let column = 0; column < field[row].length; column++) {
                const currentField = field[row][column];
                if (currentField.piece && currentField.piece.type.toLowerCase() === 'k' && currentField.piece.isWhite === isWhite) {
                    kingPosition = currentField;
                    break;
                }
            }
        }
        if (!kingPosition) {
            return false; // King not found
        }
        // Check if the king is in check
        for (let row = 0; row < field.length; row++) {
            for (let column = 0; column < field[row].length; column++) {
                const currentField = field[row][column];
                if (currentField.piece && currentField.piece.isWhite !== isWhite) {
                    // Check if any move attacking king is valid
                    if (this.isValidMove(currentField.piece, kingPosition, field)) {
                        return true; // King is in check
                    }
                }
            }
        }
        return false; // King is not in check
    }

    private static getCastlingMoves(piece: Piece, moves: Field[], field: Field[][], moveHistory: string[], all: boolean = false): void {
        const isWhite = piece.isWhite;

        // Check if the king is in check
        const kingInCheck = this.isKingInCheck(field, isWhite);
        if (kingInCheck) {
            return; // Cannot castle if the king is in check
        }

        // Add logic for castling moves
        if (piece.type.toLowerCase() === 'k' && !this.hasPieceMoved(piece, moveHistory)) {
            // Check for castling conditions
            const castlingMoves = [
                { row: piece.row, column: piece.column + 2, piece: null }, // Kingside castling
                { row: piece.row, column: piece.column - 2, piece: null }  // Queenside castling
            ];

            // Check if the rook has not moved
            const rooks: Piece[] = [
                { row: piece.row, column: 7, isWhite: isWhite, type: isWhite ? 'R' : 'r', selected: false }, // Kingside rook
                { row: piece.row, column: 0, isWhite: isWhite, type: isWhite ? 'R' : 'r', selected: false }  // Queenside rook
            ];
            for (let i = 0; i < castlingMoves.length; i++) {
                const castlingMove = castlingMoves[i];
                const rook = rooks[i];
                const rookField = field[rook.row][rook.column];

                // Check if the rook is present and has not moved
                if (rookField.piece && rookField.piece.type.toLowerCase() === 'r' && !this.hasPieceMoved(rook, moveHistory)) {
                    // check if there are any pieces between the king and rook
                    const direction = castlingMove.column > piece.column ? 1 : -1; // Determine direction (right or left)
                    let pathClear = true;
                    for (let j = piece.column + direction; j !== castlingMove.column; j += direction) {
                        if (field[piece.row][j].piece && !all) {
                            pathClear = false; // Path is not clear
                            break;
                        }
                    }
                    if (pathClear || all) {
                        // Check if the king passes through a square that is attacked
                        const squaresToCheck: Field[] = [
                            field[piece.row][piece.column + direction], // Square between king and rook
                            field[piece.row][castlingMove.column] // Square where king will move
                        ];
                        let safeToCastle = true;
                        for (const square of squaresToCheck) {
                            if (this.isOutOfBounds(square)) {
                                safeToCastle = false; // Square is out of bounds
                                break;
                            }
                            const squareField = field[square.row][square.column];
                            const boardCopy = JSON.parse(JSON.stringify(field)); // Create a deep copy of the board
                            boardCopy[piece.row][piece.column].piece = null; // Remove the king from its current position
                            boardCopy[square.row][square.column].piece = piece; // Move the king to the new position
                            boardCopy[rook.row][rook.column].piece = null; // Remove the rook from its current position
                            boardCopy[piece.row][piece.column + direction].piece = rook; // Move the rook to the new position
                            // Check if the king is in check after castling
                            if (this.isOpponentPiece(piece, squareField) || this.isKingInCheck(boardCopy, isWhite)) {
                                safeToCastle = false; // Square is attacked
                                break;
                            }
                        }
                        if (safeToCastle) {
                            moves.push(castlingMove); // Add castling move
                        }
                    }

                }
            }
        }
    }
}