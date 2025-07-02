import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-link',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LinkComponent implements OnInit {
  @Input() routerLink: string = '';
  @Input() cover: boolean = false;
  @Input() target: string = '_self';
  @Input() rel: string = 'noopener noreferrer';
  @Input() href: string = '';
  @Input() noStyle: boolean = false;
  @Input() isExternal: boolean = false;
  @Input() hover: boolean = false;

  constructor() { }

  ngOnInit() {
    if (this.isExternal) {
      this.target = '_blank';
      this.rel = 'noopener noreferrer';
    }
  }
}
