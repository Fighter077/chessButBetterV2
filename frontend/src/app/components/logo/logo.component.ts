import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { AssetLoaderService } from 'src/app/services/asset-loader/asset-loader.service';
import { LinkComponent } from "../link/link.component";

@Component({
  selector: 'app-logo',
  imports: [LinkComponent],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LogoComponent implements OnInit {
  @Input() link!: string;
  @Input() logoSrc!: string;
  svgContent: SafeHtml | null = `<svg></svg>`;

  constructor(private assetLoaderService: AssetLoaderService) { }

  ngOnInit() {
    this.loadImg();
  }

  loadImg(): void {
    this.assetLoaderService.loadSvg(this.logoSrc).subscribe((svg: SafeHtml) => {
      this.svgContent = svg;
    });
  }
}
