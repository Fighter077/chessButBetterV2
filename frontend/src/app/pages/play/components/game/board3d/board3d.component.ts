import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Field, Move, Piece } from '../../../../../interfaces/game';
import { ThreeWrapperComponent } from "../../../../../components/three-wrapper/three-wrapper.component";
import { CameraPosition, Model, SkinSet } from 'src/app/interfaces/board3d';
import { pieceFullMapping } from 'src/app/constants/chess.constants';
import { AssetLoaderService } from 'src/app/services/asset-loader/asset-loader.service';


@Component({
  selector: 'app-board3d',
  imports: [ThreeWrapperComponent],
  templateUrl: './board3d.component.html',
  styleUrl: './board3d.component.scss'
})
export class Board3dComponent implements OnInit, OnChanges {
  @Input() board: Field[][] = [];
  @Input() playerColor: 'white' | 'black' | null = null; // Default player color
  @Input() rotated: boolean = false;
  @Input() isPlaying: boolean = false; // Flag to indicate if the user is playing
  @Output() movedPiece = new EventEmitter<Move>();
  @ViewChild(ThreeWrapperComponent) threeWrapper!: ThreeWrapperComponent;

  skinOptions: SkinSet[] = [];

  initialCameraPosition: CameraPosition = { x: 0, y: 9, z: 6 };

  piecesToId: Map<string, Piece> = new Map<string, Piece>();
  fieldsToId: Map<string, Field> = new Map<string, Field>();

  models: Model[] = [];

  constructor(private assetLoaderService: AssetLoaderService) { }

  ngOnInit(): void {
    const fields = this.board.length - 1;

    // Set the camera position based on the player color
    if (this.rotated) {
      this.initialCameraPosition = { x: 0, y: 10, z: -10 };
    }

    const loadModels = (skinType: string) => {
      const boardFrameModel: Model = {
        'skinType': skinType,
        'modelFileName': 'BoardFrame',
        'x': 0,
        'y': 0,
        'z': 0,
        'textureFileName': 'BoardFrameTexture',
        'receiveShadow': true
      };
      this.models.push(boardFrameModel);
      [...this.board].reverse().forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const fieldID = 'uuid_' + crypto.randomUUID();
          this.fieldsToId.set(fieldID, cell);
          const fieldModel: Model = {
            'skinType': skinType,
            'modelFileName': 'Field',
            'x': fields * ((colIndex) / fields) - fields / 2,
            'y': 0,
            'z': fields * ((rowIndex) / fields) - fields / 2,
            'id': fieldID,
            'textureFileName': `Field${(rowIndex + colIndex) % 2 === 0 ? 'White' : 'Black'}Texture`,
            'receiveShadow': true,
            'randomOffset': true
          };
          this.models.push(fieldModel);
          if (cell !== null && cell.piece !== null) {
            const pieceType = cell.piece.type;
            if (pieceType !== null) {
              //generate a unique UUID for the piece
              const pieceID = 'uuid_' + crypto.randomUUID();
              this.piecesToId.set(pieceID, cell.piece);

              const model: Model = {
                'skinType': skinType,
                'modelFileName': pieceFullMapping[pieceType],
                'x': fields * ((colIndex) / fields) - fields / 2,
                'y': 0,
                'z': fields * ((rowIndex) / fields) - fields / 2,
                'rotationY': cell.piece.isWhite ? Math.PI : 0,
                'id': pieceID,
                'textureFileName': `${pieceFullMapping[pieceType]}${cell.piece.isWhite ? 'White' : 'Black'}Texture`,
                'castShadow': true,
                'receiveShadow': true
              };
              this.models.push(model);
            };
          }
        });
      });
    }

    //load skin options
    this.assetLoaderService.getOptions().subscribe((options: SkinSet[]) => {
      this.skinOptions = options;
      loadModels(options[0].name);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rotated'] && this.threeWrapper) {
      if (this.rotated) {
        this.threeWrapper.setCameraPosition({ x: 0, y: 10, z: -10 });
      } else {
        this.threeWrapper.setCameraPosition({ x: 0, y: 10, z: 10 });
      }
    }
    if (changes['board'] && this.threeWrapper) {
      //this.threeWrapper.updateModels(this.models);
    }
  }

  pieceClicked(pieceId: string): void {
    const piece = this.piecesToId.get(pieceId);
    const field = this.fieldsToId.get(pieceId);
    if (piece) {
      this.threeWrapper.crumbleObject(pieceId);
    }
    if (field) {
    }
  }
}
