import { Component, Input } from '@angular/core';
import { Player } from '../../../../../interfaces/game';
import { AvatarComponent } from "../../../../../components/avatar/avatar.component";
import { User } from '../../../../../interfaces/user';

@Component({
  selector: 'app-player',
  imports: [AvatarComponent],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  @Input() player: Player = { id: 0, username: '' };
  @Input() isTurn: boolean = false;

  user: User = {
    id: 0,
    username: '',
    email: '',
    role: ''
  };

  constructor() { } // Inject any required services here

  ngOnInit() {
    // Initialize the player component with any required data or services
    this.user = {
      id: this.player.id,
      username: this.player.username,
      email: '',
      role: ''
    }
  }
}
