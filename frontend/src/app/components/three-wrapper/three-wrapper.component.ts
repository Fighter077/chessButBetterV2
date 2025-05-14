import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { EngineComponent } from "./engine/engine.component";
import { UiComponent } from "./ui/ui.component";
import { CameraPosition, Model } from 'src/app/interfaces/board3d';

@Component({
  selector: 'app-three-wrapper',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EngineComponent, UiComponent],
  templateUrl: './three-wrapper.component.html',
  styleUrl: './three-wrapper.component.scss'
})
export class ThreeWrapperComponent {
  @Input() models: Model[] = [];
  @Input() initialCameraPosition: CameraPosition = { x: 0, y: 0, z: 0 };
  @Output() modelClicked: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(EngineComponent) engineComponent!: EngineComponent;

  clickedModel(modelId: string): void {
    this.modelClicked.emit(modelId);
  }

  public setCameraPosition(position: CameraPosition): void {
    this.engineComponent.setCameraPosition(position);
  }

  public crumbleObject(objectId: string): void {
    this.engineComponent.crumbleObject(objectId);
  }
}
