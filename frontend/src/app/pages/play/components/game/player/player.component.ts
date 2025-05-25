import { Component, Input } from '@angular/core';
import { Player } from '../../../../../interfaces/game';
import { AvatarComponent } from "../../../../../components/avatar/avatar.component";
import { User } from '../../../../../interfaces/user';
import { IconComponent } from "../../../../../icons/icon.component";
import { fadeInOut } from 'src/app/animations/fade.animation';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-player',
  imports: [AvatarComponent, IconComponent, CommonModule, TranslateModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  animations: [fadeInOut()]
})
export class PlayerComponent {
  @Input() player: Player = { id: 0, username: '' };
  @Input() playerTurn: Player | null = { id: 0, username: '' };
  @Input() active: boolean = false; // Flag to indicate if the player is active

  user: User = {
    id: 0,
    username: '',
    email: '',
    role: 'USER'
  };

  constructor() { } // Inject any required services here

  ngOnInit() {
    // Initialize the player component with any required data or services
    this.user = {
      id: this.player.id,
      username: this.player.username,
      email: '',
      role: 'USER'
    }
  }

  getIsTurn(): boolean {
    // Check if the current player is the one whose turn it is
    return this.playerTurn?.id === this.player.id;
  }
}
