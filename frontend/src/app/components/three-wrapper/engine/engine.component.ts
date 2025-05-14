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
  styleUrl: './engine.component.scss',
  providers: [EngineService]
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
  pointerDownPos: { x: number; y: number } | null = null;
  isTouchInteraction: boolean = false;

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
      this.engServ.animate();
    });

    if (this.parentElement !== null) {
      this.parentElement.addEventListener('mousedown', this.onMouseDown.bind(this));
      this.parentElement.addEventListener('touchstart', this.onTouchStart.bind(this));
      this.parentElement.addEventListener('mouseup', this.onMouseUp.bind(this));
      this.parentElement.addEventListener('touchend', this.onTouchEnd.bind(this));
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

  public onMouseDown(event: MouseEvent): void {
    if (this.isTouchInteraction) return; // Skip mouse if touch was detected
    this.pointerDownPos = { x: event.clientX, y: event.clientY };
  }

  public onTouchStart(event: TouchEvent): void {
    this.isTouchInteraction = true;
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.pointerDownPos = { x: touch.clientX, y: touch.clientY };
      return;
    }
    this.pointerDownPos = null;
  }

  public onMouseUp(event: MouseEvent): void {
    if (this.isTouchInteraction) {
      this.isTouchInteraction = false; // Reset after skipping one mouse sequence
      return;
    }
    if (!this.pointerDownPos) return;

    const dx = event.clientX - this.pointerDownPos.x;
    const dy = event.clientY - this.pointerDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const clickThreshold = 5; // pixels

    if (distance < clickThreshold) {
      this.onClick(event);
    }
    this.pointerDownPos = null;
  }

  public onTouchEnd(event: TouchEvent): void {
    if (!this.pointerDownPos) return;
    if (event.changedTouches.length === 1) {
      const touchEvent: any = event.changedTouches[0];
      const dx = touchEvent.clientX - this.pointerDownPos.x;
      const dy = touchEvent.clientY - this.pointerDownPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const clickThreshold = 5; // pixels
      this.pointerDownPos = null;

      if (distance < clickThreshold) {
        this.onClick(touchEvent);
      }
    }
  }

  public onClick(event: { clientX: number, clientY: number }): void {
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

  public setCameraPosition(position: CameraPosition): void {
    this.engServ.setCameraPosition(position);
  }

  public crumbleObject(id: string): void {
    this.engServ.triggerCrumble(id);
  }
}
