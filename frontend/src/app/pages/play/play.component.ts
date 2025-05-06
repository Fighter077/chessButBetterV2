import { Component } from '@angular/core';
import { GameSearchComponent } from './components/game-search/game-search.component';
import { GameService } from '../../services/game/game.service';
import { Game } from '../../interfaces/game';
import { GameComponent } from './components/game/game.component';

@Component({
  selector: 'app-play',
  imports: [
    GameSearchComponent,
    GameComponent
  ],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent {
  game: Game | null = null;

  constructor() { }

  loadGame($event: Game) {
    this.game = $event; // Set the game when it is found
  }

  gameEnded($event: void) {
    this.game = null; // Reset the game when it ends
    console.log('Game ended:', $event);
  }
}
