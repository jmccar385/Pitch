import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Band } from '../models';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState: firebase.User = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afFunctions: AngularFireFunctions
  ) {
    this.afFunctions.functions.useFunctionsEmulator('http://localhost:5000');
    this.afAuth.authState.subscribe(user => {
      this.authState = user;
    });
  }

  async login(email: string, pass: string) {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, pass);
  }

  async signup(email: string, pass: string, band: Band) {
    console.log(band);
    const callable = this.afFunctions.httpsCallable('createBandUser');
    await this.afAuth.auth.createUserWithEmailAndPassword(email, pass);
    callable(band).subscribe(console.log);
    // return await this.afAuth.auth.createUserWithEmailAndPassword(email, pass);
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
