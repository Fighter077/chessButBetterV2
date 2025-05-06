export interface Game {
    id: number;
    player1: Player;
    player2: Player;
    moves: string[];
}

export interface Player {
    id: number;
    username: string;
}

export interface Move {
    move: string;
}

export interface Field {
    row: number;
    column: number;
    piece: Piece | null;
    isHighlighted?: boolean; // Optional property to indicate if the field is highlighted
}

export interface Piece {
    row: number;
    column: number;
    isWhite: boolean;
    type: string;
    selected: boolean;
    couldBeCaptured?: boolean; // Optional property to indicate if the piece could be captured
}

export interface GameState {
    board: Field[][];
    currentPlayer: Player;
    winner: Player | null;
    gameOver: boolean;
}