import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { EngineService } from './engine.service';
import { CameraPosition, Model } from 'src/app/interfaces/board3d';
import { Object3D } from 'three';

@Component({
  selector: 'app-engine',
  imports: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './engine.component.html',
  styleUrl: './engine.component.scss'
})
export class EngineComponent implements OnInit {
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;
  private parentElement: HTMLElement | null = null;
  private observer: ResizeObserver;

  @Input()
  modelsToLoad: Model[] = [];
  @Input()
  initialCameraPosition: CameraPosition = { x: 0, y: 0, z: 0 };

  @Output()
  modelClicked: EventEmitter<string> = new EventEmitter<string>();

  clickListener: EventListener | null = null;

  public constructor(private engServ: EngineService) {
    this.observer = new ResizeObserver((entries) => {
      for (const _ of entries) {
        this.engServ.resize();
      }
    });
  }

  public ngOnInit(): void {
    this.parentElement = this.rendererCanvas.nativeElement.parentElement;
    if (this.parentElement !== null) {
      this.observer.observe(this.parentElement, {
        box: 'border-box'
      });
    }

    this.engServ.createScene(this.rendererCanvas, this.initialCameraPosition);

    const modelPromises: Promise<void>[] = [];
    this.modelsToLoad.forEach((model) => {
      modelPromises.push(this.engServ.addModel(model));
    });
    Promise.allSettled(modelPromises).then(() => {
      this.engServ.render();
    });

    if (this.parentElement !== null) {
      this.parentElement.addEventListener('click', this.onClick.bind(this));
    }
  }

  public onDestroy(): void {
    if (this.parentElement !== null) {
      this.observer.unobserve(this.parentElement);
    }
    this.observer.disconnect();

    if (this.parentElement !== null) {
      this.parentElement.removeEventListener('click', this.onClick.bind(this));
    }
  }

  public onClick(event: MouseEvent): void {
    if (this.parentElement === null) {
      return;
    }
    const bounds = this.parentElement.getBoundingClientRect();
    const x = ((event.clientX - bounds.x) / bounds.width) * 2 - 1;
    const y = -((event.clientY - bounds.y) / bounds.height) * 2 + 1;

    const pointer = { x: x, y: y };

    const object: Object3D | null = this.engServ.getObjectByCursor(pointer);

    if (object !== null) {
      const id = object.name;
      this.modelClicked.emit(id);
    }
  }
}
