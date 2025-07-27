import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleLogoComponent } from './google-logo.component';

describe('GoogleLogoComponent', () => {
  let component: GoogleLogoComponent;
  let fixture: ComponentFixture<GoogleLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
