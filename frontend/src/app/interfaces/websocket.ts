import { Game } from "./game";

export interface QueueEvent {
    type: 'MATCH_FOUND';
    content: Game;
}

export interface GameEvent {
    type: 'GAME_MOVE' | 'GAME_ENDED' | 'PLAYER_JOINED' | 'PLAYER_LEFT' | 'MOVE_ERROR';
    content: MoveEvent | MoveErrorEvent;
}

export interface MoveErrorEvent {
    moveNumber: number;
};

export interface MoveEvent {
    move: string;
    moveNumber: number;
}