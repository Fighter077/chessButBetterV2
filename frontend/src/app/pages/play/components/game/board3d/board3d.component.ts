import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Field, Move, Piece } from '../../../../../interfaces/game';
import { ThreeWrapperComponent } from "../../../../../components/three-wrapper/three-wrapper.component";
import { CameraPosition, Model } from 'src/app/interfaces/board3d';
import { pieceFullMapping } from 'src/app/constants/chess.constants';


@Component({
  selector: 'app-board3d',
  imports: [ThreeWrapperComponent],
  templateUrl: './board3d.component.html',
  styleUrl: './board3d.component.scss'
})
export class Board3dComponent implements OnInit {
  @Input() board: Field[][] = [];
  @Input() playerColor: 'white' | 'black' | null = null; // Default player color
  @Output() movedPiece = new EventEmitter<Move>();

  initialCameraPosition: CameraPosition = { x: 0, y: 9, z: 6 };

  piecesToId: Map<string, Piece> = new Map<string, Piece>();

  models: Model[] = [];

  ngOnInit(): void {
    const boardSize = 8;
    const fields = this.board.length - 1;

    // Set the camera position based on the player color
    if (this.playerColor === 'black') {
      this.initialCameraPosition = { x: 0, y: 9, z: -6 };
    }

    [...this.board].reverse().forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell !== null && cell.piece !== null) {
          const pieceType = cell.piece.type;
          if (pieceType !== null) {
            //generate a unique UUID for the piece
            const pieceID = 'uuid_' + crypto.randomUUID();
            this.piecesToId.set(pieceID, cell.piece);

            const model: Model = {
              'fileName': pieceFullMapping[pieceType],
              'x': boardSize * ((colIndex) / fields) - boardSize / 2,
              'y': 0.5,
              'z': boardSize * ((rowIndex) / fields) - boardSize / 2,
              'rotationY': cell.piece.isWhite ? 0 : Math.PI,
              'id': pieceID
            };
            if (model.fileName === 'Rook') {
              //model.textureFileName = 'rookBlackTexture';
            }
            this.models.push(model);
          };
        }
      });
    });
  }

  pieceClicked(pieceId: string): void {
    const piece = this.piecesToId.get(pieceId);
    if (piece) {
      console.log('Piece clicked:', pieceId, piece);
    }
  }
}
