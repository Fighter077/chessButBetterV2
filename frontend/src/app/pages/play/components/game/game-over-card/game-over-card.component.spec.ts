import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOverCardComponent } from './game-over-card.component';

describe('GameOverCardComponent', () => {
  let component: GameOverCardComponent;
  let fixture: ComponentFixture<GameOverCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOverCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameOverCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
