import { Component, Input } from '@angular/core';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  @Input() user: User = { id: 0, username: '', email: '', role: '' }; // Default user object
}
