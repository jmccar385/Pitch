import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent, MatSnackBar } from '@angular/material';
import { Event } from '../models';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { Location } from '@angular/common';
import { firestore } from 'firebase';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-event-scheduler',
  templateUrl: './event-scheduler.component.html',
  styleUrls: ['./event-scheduler.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventSchedulerComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService, // Will be needed after testing is complete
    private profileService: ProfileService,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private location: Location,
    private headerSvc: HeaderService
  ) {
    this.profileService
      .getVenueEventsById(this.authService.currentUserID)
      .subscribe(events => {
        events.forEach((event: Event) => {
          this.datesArray.push(event.EventDateTime);
        });
      });
  }
  private datesArray: firestore.Timestamp[] = [];

  today = new Date();

  // 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
  validHours: string[] = Array.apply(null, { length: 12 })
    .map(Number.call, Number)
    .map((x: number) => (((x + 11) % 12) + 1).toString());

  // 00, 05, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55
  validMinutes: string[] = Array.apply(null, { length: 12 })
    .map(Number.call, Number)
    .map((x: number) => (x * 5).toString().padStart(2, '0'));
  eventConflict = false;

  createEventForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),

    // TODO: Use this field
    ageRestriction: new FormControl(''),

    eventDate: new FormControl('', [Validators.required]),

    startTimeHour: new FormControl(this.validHours[0], [Validators.required]),
    startTimeMinute: new FormControl(this.validMinutes[0], [
      Validators.required
    ]),
    startTimeMeridiem: new FormControl('PM', [Validators.required])

    /* End times and durations aren't stored, so let's ignore it for now */
    // endTimeHour: new FormControl(this.validHours[0], [Validators.required]),
    // endTimeMinute: new FormControl(this.validMinutes[0], [Validators.required]),
    // endTimeMeridiem: new FormControl('PM', [Validators.required])
  });

  highlightEvents: (date: Date) => any;

  goBack() {
    this.location.back();
  }
  ngOnInit() {
    // Set header
    this.headerSvc.setHeader({
      title: 'New Event',
      iconEnd: null,
      iconStart: 'arrow_back_ios',
      endRouterlink: null,
      startRouterlink: ['/profile', 'venue', this.authService.currentUserID]
    });

    // If a date exists in the datesArray (populated using events for the
    // current venue) it will be provided a CSS class for highlighting it
    this.highlightEvents = (date: Date) => {
      if (this.datesArray !== undefined) {
        const match = (x: firestore.Timestamp) =>
          x.toDate().toDateString() === date.toDateString();

        if (this.datesArray.some(match)) {
          return 'eventDate';
        }
      }

      return undefined;
    };
  }

  // Track when dates are changed to check for conflicts on the input day
  // (shows warning - doesn't block event creation)
  dateChange(event: MatDatepickerInputEvent<Date>) {
    if (this.datesArray === undefined) {
      this.eventConflict = false;
      return;
    }

    const newVal: Date = event.value;
    const match = (x: firestore.Timestamp) =>
      x.toDate().toDateString() === newVal.toDateString();
    if (!this.datesArray.some(match)) {
      this.eventConflict = false;
      return;
    }

    // Need to show warning about existing events:
    this.eventConflict = true;
  }

  // Create the event and return to the profile screen
  createEvent() {
    const timeAsStamp = firestore.Timestamp.fromDate(
      this.createEventForm.controls.eventDate.value
    );
    const event: Event = {
      EventID: '',
      EventName: this.createEventForm.controls.name.value,
      EventDateTime: timeAsStamp,
      EventDescription: this.createEventForm.controls.description.value,
      EventRestricted: false,
      EventRestrictedAge: this.createEventForm.controls.ageRestriction.value
    };

    let inputHours: number = parseInt(
      this.createEventForm.controls.startTimeHour.value,
      10
    );
    const inputMinutes: number = parseInt(
      this.createEventForm.controls.startTimeMinute.value,
      10
    );

    if (this.createEventForm.controls.startTimeMeridiem.value === 'PM') {
      inputHours = inputHours + 12;
    }

    event.EventDateTime.toDate().setHours(inputHours);
    event.EventDateTime.toDate().setMinutes(inputMinutes);

    this.eventService
      .createEvent(event, this.authService.currentUserID)
      .then(() => {
        this.router.navigate([
          '/profile',
          'venue',
          this.authService.currentUserID
        ]);
      })
      .catch(error => {
        console.log(error);

        // Notify the user something went wrong
        this.snackBar.open(
          'Could not create event. Please try again.',
          'close',
          {
            duration: 2000
          }
        );
      });
  }
}
