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

    if (file.type.split('/')[0] !== 'image') {
      return;
    }

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
    this.uploadImage(input).then(url => {
      this.afDatabase
        .collection(collection)
        .doc(userId)
        .collection('ProfileImageUrls')
        .add({ url });
    });
  }

  updateProfilePicture(
    userId: string,
    userType: string,
    imagePath: string,
    imageDocId: string,
    currentProfileImage: string
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
      .collection('ProfileImageUrls')
      .add({ currentProfileImage });
    this.afDatabase
      .collection(collection)
      .doc(userId)
      .update({ ProfilePictureUrl: imagePath });
    this.afDatabase
      .collection(collection)
      .doc(userId)
      .collection('ProfileImageUrls')
      .doc(imageDocId)
      .delete();
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
    playlist?: Playlist,
    tracks?: Track[]
  ) {
    const update = { ProfileAddress: address, ProfileBiography: biography };
    this.afDatabase
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
      .collection('Artists')
      .doc(userId)
      .get()
      .toPromise();
  }

  createReview(
    review: Review,
    userId: string,
    userType: string,
    ratingCount: number,
    rating: number
  ) {
    let reviewCollection: string;
    let userCollection: string;
    if (userType === 'venue') {
      reviewCollection = 'Venues';
      userCollection = 'Artists';
    } else {
      reviewCollection = 'Artists';
      userCollection = 'Venues';
    }
    this.afDatabase
      .collection(userCollection)
      .doc<Band | Venue>(review.ReviewCreator)
      .valueChanges()
      .subscribe(response => {
        review.ReviewCreatorName = response.ProfileName;
        this.afDatabase
          .collection(reviewCollection)
          .doc(userId)
          .collection('Reviews')
          .add(review);
        this.afDatabase
          .collection(reviewCollection)
          .doc(userId)
          .update({
            ProfileRatingCount: ratingCount,
            ProfileRating: rating
          });
      });
  }

  getVenuesObserver() {
    return this.afDatabase.collection('Venues').valueChanges();
  }

  getVenueReviewsById(venueId: string) {
    return this.afDatabase
      .collection('Venues')
      .doc(venueId)
      .collection('Reviews')
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
