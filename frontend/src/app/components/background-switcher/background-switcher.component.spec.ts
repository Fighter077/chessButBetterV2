import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundSwitcherComponent } from './background-switcher.component';

describe('BackgroundSwitcherComponent', () => {
  let component: BackgroundSwitcherComponent;
  let fixture: ComponentFixture<BackgroundSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundSwitcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
