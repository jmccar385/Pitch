import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest } from 'rxjs';
import { map, mergeMap, tap, take } from 'rxjs/operators';
import { flatten } from '@angular/compiler';
import { Equipment, Playlist, Track, Review, Venue, Band } from '../models';

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

  deteleImage(filePath: string) {
    filePath = filePath.split('/')[7];
    filePath = filePath.substr(0, filePath.indexOf('?'));
    const path = `${filePath}`;
    this.afStorage.ref(path).delete();
  }

  updateProfileImageUrls(userId: string, userType: string, input: Blob) {
    let collection: string;
    if (userType === 'venue') {
      collection = 'Venues';
    } else {
      collection = 'Artists';
    }
    this.uploadImage(input).then((url) => {
      this.afDatabase.collection(collection).doc(userId).collection('ProfileImageUrls').add({url});
    });
  }

  updateProfilePicture(userId: string, userType: string, path: string) {
    console.log(path);
    let collection: string;
    if (userType === 'venue') {
      collection = 'Venues';
    } else {
      collection = 'Artists';
    }
    this.afDatabase.collection(collection).doc(userId).update({ProfilePictureUrl: path});
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

  createReview(review: Review, userId: string, userType: string, ratingCount: number, rating: number) {
    let reviewCollection: string;
    let userCollection: string;
    if (userType === 'venue') {
      reviewCollection = 'Venues';
      userCollection = 'Artists';
    } else {
      reviewCollection = 'Artists';
      userCollection = 'Venues';
    }
    this.afDatabase.collection(userCollection).doc<Band|Venue>(review.ReviewCreator).valueChanges().subscribe(response => {
      review.ReviewCreatorName = response.ProfileName;
      this.afDatabase.collection(reviewCollection).doc(userId).collection('Reviews').add(review);
      this.afDatabase.collection(reviewCollection).doc(userId).update({
        ProfileRatingCount: ratingCount,
        ProfileRating: rating
      });
    });
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
                ),
              this.afDatabase
                .collection(`Venues/${record.id}/Reviews`)
                .valueChanges()
                .pipe(
                  map(change => {
                    return { ...record, SubCollection: change };
                  })
                ),
              this.afDatabase
                .collection(`Venues/${record.id}/ProfileImageUrls`)
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
              ),
            this.afDatabase
              .collection(`Venues/${record.id}/Reviews`)
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
