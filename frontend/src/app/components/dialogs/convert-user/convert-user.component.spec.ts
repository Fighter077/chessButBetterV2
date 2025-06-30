import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertUserComponent } from './convert-user.component';

describe('ConvertUserComponent', () => {
  let component: ConvertUserComponent;
  let fixture: ComponentFixture<ConvertUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvertUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
