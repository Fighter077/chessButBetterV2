import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Game, TimingOption } from '../../../../interfaces/game';
import { GameService } from '../../../../services/game/game.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-search',
  imports: [
    TranslateModule
  ],
  templateUrl: './game-search.component.html',
  styleUrl: './game-search.component.scss'
})
export class GameSearchComponent implements OnInit, OnDestroy {
  @Input() lookForActiveGame: boolean = false; // Flag to determine if we should look for an active game
  timingOption: TimingOption = null; // Timing option for the game

  searching: boolean = true;
  inQueue: boolean = false;

  private queueSubscription: Subscription | undefined; // Subscription to the queue events
  private gameSubscription: Subscription | undefined; // Subscription to the game events

  @Output() gameFound: EventEmitter<Game> = new EventEmitter<Game>();

  constructor(private gameService: GameService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const startParam = this.route.snapshot.queryParamMap.get('start');
    const incrementParam = this.route.snapshot.queryParamMap.get('increment');
    if (startParam !== null && incrementParam !== null) {
      this.timingOption = {
        start: parseInt(startParam),
        increment: parseInt(incrementParam)
      };
    } else {
      this.timingOption = null; // Default to no timing option
    }
    this.searching = false;
    this.inQueue = true; // No active game found, set inQueue to true
    this.joinQueue(); // Start joining the queue
  }

  ngOnDestroy(): void {
    this.leaveQueue(); // Leave the queue when the component is destroyed
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe(); // Unsubscribe from the game events
    }
  }

  joinQueue(): void {
    this.queueSubscription = this.gameService.joinQueue(this.timingOption).subscribe(event => {
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
