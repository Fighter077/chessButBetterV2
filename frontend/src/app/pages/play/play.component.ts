import { Component } from '@angular/core';
import { GameSearchComponent } from './components/game-search/game-search.component';

@Component({
  selector: 'app-play',
  imports: [
    GameSearchComponent
  ],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent {
  searching: boolean = true;
}
