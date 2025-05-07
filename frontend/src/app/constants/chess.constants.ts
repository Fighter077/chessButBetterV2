import { Field, Piece } from "../interfaces/game"

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
    const initialBoard: string[][] = [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
    ];

    const board: Field[][] = initialBoard.map((row, rowIndex) => {
        return row.map((cell, columnIndex) => {
            const piece: Piece | null = cell ? { row: rowIndex, column: columnIndex, isWhite: cell === cell.toUpperCase(), type: cell, selected: false } : null;
            return { row: rowIndex, column: columnIndex, piece };
        });
    });

    return board;
}