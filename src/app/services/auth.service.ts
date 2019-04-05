import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Band } from '../models';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ProfileService } from './profile.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState: firebase.User = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private profileSvc: ProfileService
  ) {
    this.afAuth.authState.subscribe(user => {
      this.authState = user;
    });
  }

  async login(email: string, pass: string) {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, pass);
  }

  async signup(email: string, pass: string, band: Band, img: Blob) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, pass).then(() => {
      return this.profileSvc.uploadImage(img).then((url) => {
        band.ProfilePictureUrl = url;
        return this.afStore.collection('Artists').doc(this.authState.uid).set(band);
      });
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
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
