import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Equipment, Playlist, Track, Review, Venue, Band } from '../models';
import { map } from 'rxjs/operators';

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

  deteleImage(userId: string, userType: string, filePath: string, ProfileImageUrls: string[]) {
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
    this.afDatabase.collection(collection).doc(userId).update({ProfileImageUrls});
  }

  updateProfileImageUrls(userId: string, userType: string, ProfileImageUrls: string[]) {
    let collection: string;
    if (userType === 'venue') {
      collection = 'Venues';
    } else {
      collection = 'Artists';
    }
    this.afDatabase.collection(collection).doc(userId).update({ProfileImageUrls});
  }

  updateProfilePicture(userId: string, userType: string, imagePath: string, profileImageUrls: string[]) {
    let collection: string;
    if (userType === 'venue') {
      collection = 'Venues';
    } else {
      collection = 'Artists';
    }
    this.afDatabase.collection(collection).doc(userId).update({ProfilePictureUrl: imagePath, ProfileImageUrls: profileImageUrls});
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
      .valueChanges();
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
    return this.afDatabase.collection('Venues').snapshotChanges().pipe(
      map((changes: Array<DocumentChangeAction<{}>>) => {
        return changes.map(change => {
          return {id: change.payload.doc.id, ...change.payload.doc.data()} as Venue;
        });
      })
    );
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
