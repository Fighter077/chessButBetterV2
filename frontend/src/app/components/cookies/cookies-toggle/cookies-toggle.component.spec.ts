import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiesToggleComponent } from './cookies-toggle.component';

describe('CookiesToggleComponent', () => {
  let component: CookiesToggleComponent;
  let fixture: ComponentFixture<CookiesToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookiesToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookiesToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
