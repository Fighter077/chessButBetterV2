import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameplaySettingsComponent } from './gameplay-settings.component';

describe('GameplaySettingsComponent', () => {
  let component: GameplaySettingsComponent;
  let fixture: ComponentFixture<GameplaySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameplaySettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameplaySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
