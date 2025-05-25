import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, model, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LoadingButtonComponent } from "../../../../../components/loading-button/loading-button.component";
import { MatButtonModule } from '@angular/material/button';
import { GameEnd, Player } from 'src/app/interfaces/game';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-game-over-card',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    LoadingButtonComponent,
    TranslateModule
  ],
  templateUrl: './game-over-card.component.html',
  styleUrl: './game-over-card.component.scss'
})
export class GameOverCardComponent {
  readonly data = inject<GameEnd>(MAT_DIALOG_DATA);
  readonly player1: Player = this.data.player1;
  readonly player2: Player = this.data.player2;
  readonly result: string = this.data.result;

  results: string[] = [];

  constructor(private dialogRef: MatDialogRef<GameOverCardComponent>) {
    if (this.result === '1-0') {
      this.results = ['1', '0'];
    } else if (this.result === '0-1') {
      this.results = ['0', '1'];
    } else if (this.result === '1/2') {
      this.results = ['1/2', '1/2'];
    }
  } // Constructor for the component

  close(): void {
    this.dialogRef.close(); // Close the dialog
  }
}
