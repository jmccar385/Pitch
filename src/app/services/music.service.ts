import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SpotifyPagingPlaylist, SpotifyPagingTracks } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(public http:HttpClient) { }

  private access_token: string;
  private refresh_token: string;

  getUserPlaylists() {
  	const headers = new HttpHeaders().set("Authorization", "Bearer " + this.access_token);
  	return this.http.get<SpotifyPagingPlaylist>("https://api.spotify.com/v1/me/playlists", {headers: headers});
  }

  getPlaylistTracks(url) {
  	const headers = new HttpHeaders().set("Authorization", "Bearer " + this.access_token);
  	return this.http.get<SpotifyPagingTracks>(url, {headers: headers});
  }

  setTokens(access_token, refresh_token) {
  	this.access_token = access_token;
  	this.refresh_token = refresh_token;
  }

  getTokens() {
  	return [this.access_token, this.refresh_token]
  }
}
