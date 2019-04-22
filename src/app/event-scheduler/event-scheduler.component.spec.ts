import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSchedulerComponent } from './event-scheduler.component';

describe('EventSchedulerComponent', () => {
  let component: EventSchedulerComponent;
  let fixture: ComponentFixture<EventSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
