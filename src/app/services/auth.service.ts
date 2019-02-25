import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authState: firebase.User = null;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      this.authState = user;
    });
  }

  async login(email: string, pass: string) {
    try {
      return await this.afAuth.auth.signInWithEmailAndPassword(email, pass);
    } catch (error) {
      console.log(error);
    }
  }

  async signup(email: string, pass: string) {
    try {
      return await this.afAuth.auth.createUserWithEmailAndPassword(email, pass);
    } catch (error) {
      console.log(error);
    }
  }

  get authenticated(): boolean {
    return this.authState  !== null;
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
}
