import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';
import { Game } from '../../interfaces/game';
import { GameSearchComponent } from './components/game-search/game-search.component';
import { GameComponent } from './components/game/game.component';
import { CommonModule } from '@angular/common';
import { LoadingButtonComponent } from "../../components/loading-button/loading-button.component";
import { User } from 'src/app/interfaces/user';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [GameSearchComponent, GameComponent, CommonModule, LoadingButtonComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements OnInit {
  games: (Game | null)[] = [];

  user$: Observable<User | null> = this.userService.user$;

  isGameIDUrl: boolean = false;
  gameID: number | null = null;

  allowNewGame: boolean = !environment['only-allowed-to-play-once']; // Flag to allow new game creation

  constructor(private router: Router, private route: ActivatedRoute, private gameService: GameService, private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['gameID']) {
        this.gameID = parseInt(params['gameID']);
        this.isGameIDUrl = true;
        this.gameService.getGame(this.gameID).subscribe(game => {
          if (game) {
            this.gameID
            this.games = this.games.filter(g => g?.id !== game.id); // Remove any existing game with the same ID
            this.games.unshift(game);
            console.log('Game loaded from URL:', game);
          } else {
            console.error('Game not found');
          }
        });
      }
      this.gameService.getActiveGames().subscribe(games => {
        games.filter(game => game.id !== this.gameID).forEach(game => {
          this.games.push(game);
        });
        if (this.games.length === 0 && !this.gameID) {
          // If no games are found, add a null entry to the array
          // so a new game is queued
          this.games.push(null);
        }
        console.log('Active games loaded:', this.games);
      });
    });
  }

  loadGame(index: number, $event: Game) {
    this.games[index] = $event;
    if (index === 0 && !this.isGameIDUrl) {
      this.router.navigate(['game', $event.id], {
        skipLocationChange: false,
        replaceUrl: false
      });
    }
  }

  gameEnded(index: number, $event: void) {
    // Handle game end here
  }

  addGame() {
    if (this.games[this.games.length - 1] !== null) {
      // Check if the last game slot is filled before adding a new one
      this.games.push(null);
      console.log('New game slot added');
    }
  }
}
