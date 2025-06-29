import { DrawOfferEvent } from "./websocket";

export interface Game {
    id: number;
    player1: Player;
    player2: Player;
    moves: Move[];
    result: ResultType | null;
    drawOffer?: DrawOfferEvent | null;
    player1TimeLeft?: number; // Time left for player 1 in milliseconds
    player2TimeLeft?: number; // Time left for player 2 in milliseconds
}

export interface GameNotFound {
    id: number;
    status: 'not-found';
}

export interface GameEnd {
    player1: Player;
    player2: Player;
    result: ResultType;
}

export type ResultType = '1-0' | '0-1' | '1/2'

export interface Player {
    id: number;
    username: string;
    inCheck?: boolean; // Optional property to indicate if the player is in check
    isCheckmate?: boolean; // Optional property to indicate if the player is in checkmate
}

export interface Move {
    move: string;
    moveNumber?: number;
    timeUsed?: number; // Time used for the move in milliseconds
    stringRepresentation?: string; // Optional property to store the string representation of the move
}

export interface Field {
    row: number;
    column: number;
    piece: Piece | null;
    isHighlighted?: boolean; // Optional property to indicate if the field is highlighted
}

export interface Piece {
    id: number;
    row: number;
    column: number;
    isWhite: boolean;
    type: PieceType
    selected: boolean;
    couldBeCaptured?: boolean; // Optional property to indicate if the piece could be captured
}

//define some type to store the piece type
export type PieceType = 'R' | 'N' | 'B' | 'Q' | 'K' | 'P' |// Rook, Knight, Bishop, Queen, King, Pawn
    'r' | 'n' | 'b' | 'q' | 'k' | 'p' | ''; // Lowercase for black pieces

export interface GameState {
    board: Field[][];
    currentPlayer: Player;
    winner: Player | null;
    gameOver: boolean;
}

export interface TimingOptions {
    [key: string]: {
        'icon'?: string,
        'options': TimingOption[];
    }
}

export type TimingOption = {
    'name'?: string;
    'start': number; // Time in seconds
    'increment': number; // Increment in seconds
} | null; // Null for no timing option

export interface DemoGame {
    id: number;
    player1: Player;
    player2: Player;
    moves: Move[];
    result: ResultType | null;
    demoInfo: string;
    startTime?: Date; // Optional property to indicate the start time of the demo game
}