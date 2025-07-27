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
  @ViewChild("cleanSvg", { static: true })
  cleanSvg!: ElementRef<HTMLDivElement>;

  @ViewChild("svgWrapperOuter", { static: true })
  svgWrapperOuter!: ElementRef<HTMLDivElement>;

  @Input() link!: string;
  @Input() logoSrcClean!: string;
  @Input() logoSrc!: string;
  @Input() borderRadius: number = 0;
  @Input() adjustHeight: boolean = false;
  svgContentClean: SafeHtml | null = null;
  svgContent: SafeHtml | null = null;

  constructor(private assetLoaderService: AssetLoaderService) { }

  ngOnInit() {
    this.loadImg();

    if (this.borderRadius > 0) {
      this.cleanSvg.nativeElement.style.borderRadius = `${this.borderRadius}px`;
    }

    if (this.adjustHeight) {
      this.svgWrapperOuter.nativeElement.style.height = '100%';
      this.svgWrapperOuter.nativeElement.style.width = 'unset';
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
