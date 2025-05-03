import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeDisplayComponent } from './theme-display.component';

describe('ThemeDisplayComponent', () => {
  let component: ThemeDisplayComponent;
  let fixture: ComponentFixture<ThemeDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
