import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private spotify_client_id: string = "899e98458a4849cea651cbdb55988946";
  private spotify_client_secret: string = "5412fa0cf45b489c880422d1fa53b8aa";
  
  constructor(private http: HttpClient) {}

  authenticateWithSpotify() {
  	//let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*').set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS').set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
  	let params = new HttpParams().set("client_id", this.spotify_client_id).set("response_type", "code").set("redirect_uri", "localhost:4200/signup/band").set("scope", "playlist-read-private");
  	this.http.get("https://accounts.spotify.com/authorize", {params: params}).subscribe(response => console.log(response));
  	//window.location.href = 'https://accounts.spotify.com/authorize?client_id=899e98458a4849cea651cbdb55988946&response_type=code&redirect_uri=localhost:4200/signup/band&scope=playlist-read-private';
  }
}
