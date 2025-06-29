import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeIndicatorComponent } from './time-indicator.component';

describe('TimeIndicatorComponent', () => {
  let component: TimeIndicatorComponent;
  let fixture: ComponentFixture<TimeIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
