import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
  @ViewChild("cleanSvg", { static: true }) cleanSvg!: ElementRef<HTMLDivElement>;
  @Input() link!: string;
  @Input() logoSrcClean!: string;
  @Input() logoSrc!: string;
  @Input() borderRadius: number = 0;
  svgContentClean: SafeHtml | null = null;
  svgContent: SafeHtml | null = null;

  constructor(private assetLoaderService: AssetLoaderService) { }

  ngOnInit() {
    this.loadImg();

    // Set the border radius if provided
    if (this.borderRadius > 0) {
      console.log(this.cleanSvg);
      this.cleanSvg.nativeElement.style.borderRadius = `${this.borderRadius}px`;
    }
  }

  loadImg(): void {
    // Wait for both to load before setting the content
    const promises: Promise<SafeHtml>[] = [
      new Promise((resolve, reject) => {
        this.assetLoaderService.loadSvg(this.logoSrcClean).subscribe({
          next: (svg: SafeHtml) => resolve(svg),
          error: () => {
            reject();
          }
        });
      }),
      new Promise((resolve, reject) => {
        this.assetLoaderService.loadSvg(this.logoSrc).subscribe({
          next: (svg: SafeHtml) => resolve(svg),
          error: () => {
            reject();
          }
        });
      })
    ];
    Promise.all(promises).then(([cleanSvg, svg]) => {
      this.svgContentClean = cleanSvg;
      this.svgContent = svg;
    });
  }
}
