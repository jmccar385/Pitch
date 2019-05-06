import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { flatten } from '@angular/compiler';
import { Equipment, Playlist, Track } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private afDatabase: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}

  uploadImage(input: Blob) {
    const file = input;

    if (file.type.split('/')[0] !== ('image')) { return; }

    const path = `${new Date().getTime()}`;
    const ref = this.afStorage.ref(path);
    return ref.put(file).then(() => {
      return ref.getDownloadURL().toPromise();
    });
  }

  getArtistObserver() {
    return this.afDatabase.collection('Artists').valueChanges();
  }

  getEquipmentList() {
    return this.afDatabase.collection<Equipment>('Equipment').valueChanges();
  }

  updateArtistById(userId: string, address: string, biography: string, playlist?: Playlist, tracks?: Track[]) {
    const update = {ProfileAddress: address, ProfileBiography: biography};
    this.afDatabase.collection('Artists').doc(userId).update(update);
  }

  updateVenueById(userId: string, availableEquipment: Equipment[], address: string, biography: string) {
    const update = {AvailableEquipment: availableEquipment, ProfileAddress: address, ProfileBiography: biography};
    this.afDatabase.collection('Venues').doc(userId).update(update);
  }

  getArtistObserverById(userId: string) {
    return this.afDatabase
      .collection('Artists')
      .doc(userId)
      .get()
      .toPromise();
  }

  getVenueObserver() {
    return this.afDatabase
      .collection('Venues')
      .snapshotChanges()
      .pipe(
        map(item => {
          return item.map(snapshot => {
            const record = {
              id: snapshot.payload.doc.id,
              ...snapshot.payload.doc.data()
            };

            return [
              this.afDatabase
                .collection(`Venues/${record.id}/AvailableEquipment`)
                .valueChanges()
                .pipe(
                  map(change => {
                    return { ...record, SubCollection: change };
                  })
                ),
              this.afDatabase
                .collection(`Venues/${record.id}/Events`)
                .valueChanges()
                .pipe(
                  map(change => {
                    return { ...record, SubCollection: change };
                  })
                )
            ];
          });
        })
      )
      .pipe(
        mergeMap(result => {
          const flattened = flatten(result);
          return combineLatest(flattened);
        })
      );
  }

  getVenueObserverById(userId: string) {
    return this.afDatabase
      .collection('Venues')
      .doc(userId)
      .get()
      .pipe(
        map(doc => {
          const record = {
            id: doc.id,
            ...doc.data()
          };

          return [
            this.afDatabase
              .collection(`Venues/${record.id}/AvailableEquipment`)
              .valueChanges()
              .pipe(
                map(change => {
                  return { ...record, SubCollection: change };
                })
              ),
            this.afDatabase
              .collection(`Venues/${record.id}/Events`)
              .valueChanges()
              .pipe(
                map(change => {
                  return { ...record, SubCollection: change };
                })
              )
          ];
        })
      )
      .pipe(
        mergeMap(result => {
          return combineLatest(result);
        })
      );
  }

  getVenueEventObserverById(userId: string) {
    return this.afDatabase
      .collection('Venues')
      .doc(userId)
      .collection('Events')
      .get()
      .toPromise();
  }
}
