import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { AssetLoaderService } from 'src/app/services/asset-loader/asset-loader.service';
import { LinkComponent } from "../../link/link.component";

@Component({
  selector: 'app-google-logo',
  imports: [LinkComponent],
  templateUrl: './google-logo.component.html',
  styleUrl: './google-logo.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class GoogleLogoComponent {
  @Input() link: string = 'https://www.google.com/';
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
