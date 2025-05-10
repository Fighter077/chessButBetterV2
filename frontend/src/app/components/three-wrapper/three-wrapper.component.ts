import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
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

  clickedModel(modelId: string): void {
    this.modelClicked.emit(modelId);
  }
}
