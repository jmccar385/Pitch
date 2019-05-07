import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Band, Venue, SpotifyAccess } from '../models';
import { ProfileService } from './profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState: firebase.User = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private profileSvc: ProfileService,
    private http: HttpClient
  ) {
    this.afAuth.authState.subscribe(user => {
      this.authState = user;
    });
  }

  requestAuthorizationSpotify() {
    const url = 'https://us-central1-pitch-9db22.cloudfunctions.net/authSpotify';
    return this.http.get(url);
  }

  // returns promise that resolves tokens
  async authorizeSpotify(code: string, state: string) {
    const url = 'https://us-central1-pitch-9db22.cloudfunctions.net/callbackSpotify';
    return await this.http.post<SpotifyAccess>(url, {code, state}).toPromise();
  }

  async login(email: string, pass: string) {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, pass);
  }

  async signupBand(email: string, pass: string, band: Band, img: Blob) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, pass).then(() => {
      return this.profileSvc.uploadImage(img).then((url) => {
        band.ProfilePictureUrl = url;
        return this.afStore.collection('Artists').doc(this.authState.uid).set(band);
      });
    });
  }

  async signupVenue(email: string, pass: string, venue: Venue, img: Blob) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, pass).then(() => {
      return this.profileSvc.uploadImage(img).then((url) => {
        venue.ProfilePictureUrl = url;
        return this.afStore.collection('Venues').doc(this.authState.uid).set(venue);
      });
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get verified(): boolean {
    return this.authState.emailVerified;
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  get currentUser() {
    return this.authState ? this.authState : null;
  }

  get currentUserObservable() {
    return this.afAuth.authState;
  }

  get currentUserID() {
    return this.authState ? this.authState.uid : null;
  }

  async resetPassword(email: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(email);
  }

  verification() {
    return this.afAuth.auth.currentUser.sendEmailVerification();
  }
}
