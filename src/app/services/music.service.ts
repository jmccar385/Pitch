import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpotifyPagingPlaylist, SpotifyPagingTracks } from '../models';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  constructor(
    private http: HttpClient,
    private afStore: AngularFirestore,
    private authSvc: AuthService,
    private afFunctions: AngularFireFunctions) {}

  private accessToken: string;
  private refreshToken: string;

  async renewAccessToken() {
    const func = this.afFunctions.httpsCallable('refreshToken');
    let response =  await func({}).toPromise();
    response = JSON.parse(response);
    if (response.access_token) {
      return await this.afStore.doc(`Artists/${this.authSvc.currentUserID}`).get().toPromise().then(doc => {
        const spotifyTokens = doc.data().spotifyTokens;
        return doc.ref.update({
          spotifyTokens: {...spotifyTokens, accessToken: response.access_token}
        });
      });
    }
  }

  async getUserPlaylists() {
    if (!this.accessToken) {
      this.accessToken = await this.afStore.doc(`Artists/${this.authSvc.currentUserID}`).get().toPromise().then(docRef => {
        return docRef.data().spotifyTokens.accessToken;
      });
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.accessToken
    );
    return this.http.get<SpotifyPagingPlaylist>(
      'https://api.spotify.com/v1/me/playlists',
      { headers }
    ).toPromise();
  }

  setSpotifyTokens() {
    const accessToken = this.accessToken;
    const refreshToken = this.refreshToken;
    this.afStore.doc(`Artists/${this.authSvc.currentUserID}`).update({spotifyTokens: {accessToken, refreshToken}});
  }

  getPlaylistTracks(url: any) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.accessToken
    );
    return this.http.get<SpotifyPagingTracks>(url, { headers });
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  getTokens() {
    return [this.accessToken, this.refreshToken];
  }
}
