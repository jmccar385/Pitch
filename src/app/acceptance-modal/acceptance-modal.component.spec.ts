import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceModalComponent } from './acceptance-modal.component';

describe('AcceptanceModalComponent', () => {
  let component: AcceptanceModalComponent;
  let fixture: ComponentFixture<AcceptanceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptanceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
