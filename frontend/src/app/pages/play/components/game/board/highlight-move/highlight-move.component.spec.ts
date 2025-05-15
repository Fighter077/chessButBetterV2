import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightMoveComponent } from './highlight-move.component';

describe('HighlightMoveComponent', () => {
  let component: HighlightMoveComponent;
  let fixture: ComponentFixture<HighlightMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighlightMoveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighlightMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
