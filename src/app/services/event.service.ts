import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private afStore: AngularFirestore) {}

  async createEvent(event: Event) {
    return await this.afStore
      .collection('Events')
      .add(event);
  }

  linkEventWithVenue(ownerID: string, eventID: string, event: Event) {
    event.EventID = eventID;

    return this.afStore
      .collection('Venues')
      .doc(ownerID)
      .collection('Events')
      .doc(eventID)
      .set(event);
  }
}
