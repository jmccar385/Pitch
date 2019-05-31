import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  AngularFirestore,
  DocumentChangeAction
} from '@angular/fire/firestore';
import { Equipment, Playlist, Track, Review, Venue, Band } from '../models';
import { map, tap, mergeMap } from 'rxjs/operators';
import * as firebase from 'firebase';

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

    if (file.type.split('/')[0] !== 'image') {
      return;
    }

    const path = `${new Date().getTime()}`;
    const ref = this.afStorage.ref(path);
    return ref.put(file).then(() => {
      return ref.getDownloadURL().toPromise();
    });
  }

  deleteImage(
    userId: string,
    userType: string,
    filePath: string,
    ProfileImageUrls: string[]
  ) {
    let collection: string;
    if (userType === 'venue') {
      collection = 'Venues';
    } else {
      collection = 'Artists';
    }
    filePath = filePath.split('/')[7];
    filePath = filePath.substr(0, filePath.indexOf('?'));
    const path = `${filePath}`;
    this.afStorage.ref(path).delete();
    this.afDatabase
      .collection(collection)
      .doc(userId)
      .update({ ProfileImageUrls });
  }

  updateProfileImageUrls(
    userId: string,
    userType: string,
    ProfileImageUrls: string[]
  ) {
    let collection: string;
    if (userType === 'venue') {
      collection = 'Venues';
    } else {
      collection = 'Artists';
    }
    this.afDatabase
      .collection(collection)
      .doc(userId)
      .update({ ProfileImageUrls });
  }

  updateProfilePicture(
    userId: string,
    userType: string,
    imagePath: string,
    profileImageUrls: string[],
    keep: boolean,
    oldProfileImage: string
  ) {
    let collection: string;
    if (userType === 'venue') {
      collection = 'Venues';
    } else {
      collection = 'Artists';
    }
    this.afDatabase
      .collection(collection)
      .doc(userId)
      .update({
        ProfilePictureUrl: imagePath,
        ProfileImageUrls: profileImageUrls
      });
    if (!keep) {
      oldProfileImage = oldProfileImage.split('/')[7];
      oldProfileImage = oldProfileImage.substr(0, oldProfileImage.indexOf('?'));
      const path = `${oldProfileImage}`;
      this.afStorage.ref(path).delete();
    }
  }

  getArtistObserver() {
    return this.afDatabase.collection('Artists').valueChanges();
  }

  getEquipmentList() {
    return this.afDatabase.collection<Equipment>('Equipment').valueChanges();
  }

  updateArtistById(
    userId: string,
    address: string,
    biography: string,
    playlist: Playlist,
    tracks: Track[],
    radius: number
  ) {
    const update = {
      ProfileAddress: address,
      ProfileBiography: biography,
      Playlist: playlist,
      Tracks: tracks,
      SearchRadius: radius
    };
    return this.afDatabase
      .collection('Artists')
      .doc(userId)
      .update(update);
  }

  updateVenueById(
    userId: string,
    availableEquipment: Equipment[],
    address: string,
    biography: string
  ) {
    const update = {
      AvailableEquipment: availableEquipment,
      ProfileAddress: address,
      ProfileBiography: biography
    };
    this.afDatabase
      .collection('Venues')
      .doc(userId)
      .update(update);
  }

  getArtistObserverById(userId: string) {
    return this.afDatabase
      .collection<Band>('Artists')
      .doc(userId)
      .valueChanges();
  }

  async createReview(
    review: Review,
    userId: string,
    userType: string,
  ) {
    let profileCollection: string;
    let userCollection: string;
    if (userType === 'venue') {
      profileCollection = 'Venues';
      userCollection = 'Artists';
    } else {
      profileCollection = 'Artists';
      userCollection = 'Venues';
    }

    await this.afDatabase.collection(`${profileCollection}/${userId}/Reviews`).add(review);
    await this.afDatabase.doc(`${profileCollection}/${userId}`).get().pipe(
      mergeMap(doc => {
        const data = doc.data() as Band | Venue;
        const newCount = data.ProfileRatingCount + 1;
        const newRating = (data.ProfileRating + review.ReviewRating) / newCount;
        return doc.ref.update({
          ProfileRating: newRating,
          ProfileRatingCount: newCount
        });
      })
    ).toPromise();
  }

  getVenuesObserver() {
    return this.afDatabase
      .collection<Venue>('Venues')
      .snapshotChanges()
      .pipe(
        map((changes: Array<DocumentChangeAction<{}>>) => {
          return changes.map(change => {
            return {
              id: change.payload.doc.id,
              ...change.payload.doc.data()
            } as Venue;
          });
        })
      );
  }

  getReviewsByIdAndType(uid: string, type: string) {
    const colType = (type === 'band') ? 'Artists' : 'Venues';
    return this.afDatabase.collection<Review>(`${colType}/${uid}/Reviews`)
      .valueChanges();
  }

  getVenueEventsById(venueId: string) {
    return this.afDatabase
      .collection('Venues')
      .doc(venueId)
      .collection('Events')
      .valueChanges();
  }

  getVenueObserverById(userId: string) {
    return this.afDatabase
      .collection('Venues')
      .doc(userId)
      .valueChanges();
  }
}
