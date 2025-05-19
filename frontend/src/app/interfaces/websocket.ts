import { Game, Player } from "./game";

export interface QueueEvent {
    type: 'MATCH_FOUND';
    content: Game;
}

export interface GameEvent {
    type: 'GAME_MOVE' | 'GAME_ENDED' | 'PLAYER_JOINED' | 'PLAYER_LEFT' | 'MOVE_ERROR' | 'DRAW_OFFER';
    content: PlayerJoinedEvent | MoveEvent | MoveErrorEvent | GameEndEvent | DrawOfferEvent;
}

export interface PlayerJoinedEvent {
    player: Player;
    gameState: Game;
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

export interface DrawOfferEvent {
    type: 'OFFERED' | 'REJECTED';
    initiatorID: number;
}