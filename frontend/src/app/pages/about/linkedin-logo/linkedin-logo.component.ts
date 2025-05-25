import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { AssetLoaderService } from 'src/app/services/asset-loader/asset-loader.service';
import { LinkComponent } from "../../../components/link/link.component";

@Component({
  selector: 'app-linkedin-logo',
  imports: [LinkComponent],
  templateUrl: './linkedin-logo.component.html',
  styleUrl: './linkedin-logo.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LinkedinLogoComponent {
  @Input() link: string = 'https://www.linkedin.com';
  svgContent: SafeHtml | null = `<svg></svg>`;

  constructor(private assetLoaderService: AssetLoaderService) {
      this.loadImg();
    }
  
    loadImg(): void {
      this.assetLoaderService.loadSvg('brands/linkedin.svg').subscribe((svg: SafeHtml) => {
        this.svgContent = svg;
      });
    }
}
