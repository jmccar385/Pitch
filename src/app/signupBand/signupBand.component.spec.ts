import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupBandComponent } from './signupBand.component';

describe('SignupComponent', () => {
  let component: SignupBandComponent;
  let fixture: ComponentFixture<SignupBandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupBandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupBandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
