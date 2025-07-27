import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinLogoComponent } from './linkedin-logo.component';

describe('LinkedinLogoComponent', () => {
  let component: LinkedinLogoComponent;
  let fixture: ComponentFixture<LinkedinLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedinLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkedinLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
