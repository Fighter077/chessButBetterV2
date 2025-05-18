import { CommonModule } from '@angular/common';
import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { Field, Game, Piece } from '../../../../../interfaces/game';
import { GameService } from '../../../../../services/game/game.service';
import { getInitialBoard, pieceMapping } from '../../../../../constants/chess.constants';
import { MoveCalculator } from '../board/move.calculator';

@Component({
  selector: 'app-move-history',
  imports: [
    CommonModule
  ],
  templateUrl: './move-history.component.html',
  styleUrl: './move-history.component.scss'
})
export class MoveHistoryComponent implements OnInit, DoCheck {
  @Input() game: Game = {} as Game;
  @Input() stacked: boolean = false;

  moveHistory: string[] = [];

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.setMoveHistory();
  }

  ngDoCheck(): void {
    this.setMoveHistory();
  }

  setMoveHistory(): void {
    this.moveHistory = []; // Reset move history
    let board: Field[][] = getInitialBoard();
    if (this.game.moves) {
      for (let i = 0; i < this.game.moves.length; i++) {
        const move: string = this.game.moves[i];
        this.moveHistory.push(this.getMove(move, board));
        board = this.gameService.movesToBoard([move], board);
      }
    }
  }

  getMove(move: string, board: Field[][]): string {
    // Account for castling
    if (move.length === 6 && move.charAt(4) === 'c') {
      if (move.charAt(5) === 's') {
        return 'O-O';
      }
      if (move.charAt(5) === 'l') {
        return 'O-O-O';
      }
    }
    const { fromCol, fromRow, toCol, toRow } = this.gameService.convertFromMove(move);
    const piece: Piece = board[fromRow][fromCol].piece!;
    const isWhite = piece.isWhite;
    const boardCopy: Field[][] = this.gameService.movesToBoard([move], JSON.parse(JSON.stringify(board)));
    const isCheck = MoveCalculator.isKingInCheck(boardCopy, !isWhite) ? '+' : '';
    const pieceName: string = pieceMapping[piece.type];

    const pieceCaptured: string = board[toRow][toCol].piece ? 'x' : '';

    const from = move.charAt(0) + move.charAt(1);
    const to = move.charAt(2) + move.charAt(3);

    const moveString: string = `${pieceName}${pieceCaptured}${to}${isCheck}`;
    return moveString;
  }

  get movePairs(): string[][] {
    const pairs: string[][] = [];
    const dummyHistory: string[] = JSON.parse(JSON.stringify(this.moveHistory));
    if (dummyHistory.length % 2 !== 0) {
      //dummyHistory.push('');
    }
    for (let i = 0; i < dummyHistory.length; i += 2) {
      pairs.push(dummyHistory.slice(i, i + 2));
    }
    return pairs.reverse();
  }
}