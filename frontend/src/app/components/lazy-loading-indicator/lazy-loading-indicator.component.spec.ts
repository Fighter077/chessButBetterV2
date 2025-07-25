import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyLoadingIndicatorComponent } from './lazy-loading-indicator.component';

describe('LazyLoadingIndicatorComponent', () => {
  let component: LazyLoadingIndicatorComponent;
  let fixture: ComponentFixture<LazyLoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LazyLoadingIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LazyLoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
