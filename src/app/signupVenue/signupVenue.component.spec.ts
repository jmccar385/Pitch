import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupVenueComponent } from './signupVenue.component';

describe('SignupVenueComponent', () => {
  let component: SignupVenueComponent;
  let fixture: ComponentFixture<SignupVenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupVenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
