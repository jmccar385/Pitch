import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SpotifyPagingPlaylist, SpotifyPagingTracks } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(public http: HttpClient) { }

  private accessToken: string;
  private refreshToken: string;

  getUserPlaylists() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);
    return this.http.get<SpotifyPagingPlaylist>('https://api.spotify.com/v1/me/playlists', {headers});
  }

  getPlaylistTracks(url) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);
    return this.http.get<SpotifyPagingTracks>(url, {headers});
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  getTokens() {
    return [this.accessToken, this.refreshToken]
  }
}
