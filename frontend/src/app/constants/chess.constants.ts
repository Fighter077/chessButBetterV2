import { Field, Piece, PieceType } from "../interfaces/game"

export const pieceMapping: { [key: string]: string } = {
    //lowercase is black pieces
    'p': '♟',
    'r': '♜',
    'n': '♞',
    'b': '♝',
    'q': '♛',
    'k': '♚',
    //uppercase is white pieces
    'P': '♙',
    'R': '♖',
    'N': '♘',
    'B': '♗',
    'Q': '♕',
    'K': '♔'
}

export const getInitialBoard: () => Field[][] = () => {
    const initialBoard: PieceType[][] = [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
    ];

    let id = 0;
    const board: Field[][] = initialBoard.map((row, rowIndex) => {
        return row.map((cell: PieceType, columnIndex) => {
            const piece: Piece | null = cell ? { id: id++, row: rowIndex, column: columnIndex, isWhite: cell === cell.toUpperCase(), type: cell, selected: false } : null;
            return { row: rowIndex, column: columnIndex, piece };
        });
    });
    return board;
}

export const pieceFullMapping: { [key: string]: string } = {
    'p': 'Pawn',
    'r': 'Rook',
    'n': 'Knight',
    'b': 'Bishop',
    'q': 'Queen',
    'k': 'King',
    //uppercase is white pieces
    'P': 'Pawn',
    'R': 'Rook',
    'N': 'Knight',
    'B': 'Bishop',
    'Q': 'Queen',
    'K': 'King'
}