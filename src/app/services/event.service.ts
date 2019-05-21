import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private afStore: AngularFirestore) {}

  async createEvent(event: Event, uid: string) {
    const eventsRef = this.afStore.collection('Events');
    const venueRef = this.afStore.doc(`Venues/${uid}`);

    await eventsRef.add(event);
    await venueRef.collection('Events').add(event);
    await venueRef.get().toPromise().then(snap => {
      const upcomingEvents = snap.data().upcomingEvents + 1;
      return venueRef.update({upcomingEvents});
    });
  }
}
