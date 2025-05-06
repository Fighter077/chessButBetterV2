import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-link',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss'
})
export class LinkComponent {
  @Input() routerLink: string = '';
  @Input() target: string = '_self';
  @Input() rel: string = 'noopener noreferrer';
  @Input() href: string = '';
  @Input() noStyle: boolean = false;
  @Input() isExternal: boolean = false;

  constructor() {}
}
