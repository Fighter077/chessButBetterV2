import { Component, Input } from '@angular/core';
import { User } from '../../interfaces/user';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-avatar',
  imports: [
    CommonModule,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  @Input() user: User = { id: 0, username: '', email: '', role: 'USER' }; // Default user object
  @Input() menu: boolean = false; // Flag to determine if the avatar is part of a menu
}
