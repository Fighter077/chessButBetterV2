import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { AssetLoaderService } from 'src/app/services/asset-loader/asset-loader.service';
import { LinkComponent } from "../../link/link.component";

@Component({
  selector: 'app-instagram-logo',
  imports: [LinkComponent],
  templateUrl: './instagram-logo.component.html',
  styleUrl: './instagram-logo.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InstagramLogoComponent {
  @Input() link: string = 'https://www.instagram.com/';
  svgContent: SafeHtml | null = "<svg></svg>";

  constructor(private assetLoaderService: AssetLoaderService) {
    this.loadImg();
  }

  loadImg(): void {
    this.assetLoaderService.loadSvg('brands/instagram.svg').subscribe((svg: SafeHtml) => {
      this.svgContent = svg;
    });
  }
}
