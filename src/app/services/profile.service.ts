import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  constructor(private afDatabase: AngularFirestore, private afStorage: AngularFireStorage, private router: Router) {
  }

  getArtistObserver() {
    return this.afDatabase.collection("Artists").valueChanges();
  }

  getVenueObserver() {
    return this.afDatabase.collection("Venues").valueChanges();
  }

  async getEquipment(listID: string) {
    return await this.afDatabase.collection("EquipmentList", ref => ref.where("ListID", "==", listID)).get().toPromise();
  }

  async getEvents(listID: string) {
    return await this.afDatabase.collection("EventsList", ref => ref.where("ListID", "==", listID)).get().toPromise();
  }

  async getImages(listID: string) {
    return await this.afDatabase.collection("ImagesList", ref => ref.where("ListID", "==", listID)).get().toPromise();
  }

  async getImageUrl(ref: any) {
    let record = await ref.get();
    let image = await this.afStorage.ref(record.data().ImageName);

    return await image.getDownloadURL().toPromise();
  }
}
