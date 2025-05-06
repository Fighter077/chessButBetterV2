import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Game } from '../../../../interfaces/game';
import { GameService } from '../../../../services/game/game.service';

@Component({
  selector: 'app-game-search',
  imports: [],
  templateUrl: './game-search.component.html',
  styleUrl: './game-search.component.scss'
})
export class GameSearchComponent implements OnInit, OnDestroy {
  searching: boolean = true;
  inQueue: boolean = false;

  private queueSubscription: any;

  @Output() gameFound: EventEmitter<Game> = new EventEmitter<Game>();

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getActiveGame().subscribe(game => {
      this.searching = false;
      if (game) {
        this.gameFound.emit(game); // Emit the found game
      } else {
        this.inQueue = true; // No active game found, set inQueue to true
        this.joinQueue(); // Start joining the queue
      }
    });
  }

  ngOnDestroy(): void {
    this.leaveQueue(); // Leave the queue when the component is destroyed
  }

  joinQueue(): void {
    this.queueSubscription = this.gameService.joinQueue().subscribe(event => {
      if (event.type === 'MATCH_FOUND') {
        this.searching = false; // Stop searching
        this.inQueue = false; // Not in queue anymore
        this.leaveQueue();
        this.gameFound.emit(event.content); // Emit the found game
      }
    });
  }

  leaveQueue(): void {
    if (this.queueSubscription) {
      this.queueSubscription.unsubscribe();
    }
    this.gameService.disconnectQueue();
  }
}
