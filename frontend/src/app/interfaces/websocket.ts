import { Game, Move, Player } from "./game";

export interface QueueEvent {
    type: 'MATCH_FOUND';
    content: Game;
}

export interface GameEvent {
    type: 'GAME_MOVE' | 'GAME_ENDED' | 'PLAYER_JOINED' | 'PLAYER_LEFT' | 'MOVE_ERROR';
    content: MoveEvent | MoveErrorEvent | GameEndEvent;
}

export interface MoveErrorEvent {
    moveNumber: number;
};

export interface MoveEvent {
    move: string;
    moveNumber: number;
}

export interface GameEndEvent {
    winner?: Player;
    reason: 'CHECKMATE' | 'RESIGNATION' | 'TIMEOUT' | 'DRAW';
    move?: string;
    moveNumber?: number;
}