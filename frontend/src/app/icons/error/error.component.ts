import { Component } from '@angular/core';
import { IconComponent } from '../icon.component';
import { theme } from '../../constants/themes.constants';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [
    IconComponent
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  theme = theme;
}
