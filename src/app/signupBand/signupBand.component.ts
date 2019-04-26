import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MusicService } from '../services/music.service';
import { MatSnackBar } from '@angular/material';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { Band, Playlist } from '../models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'band-signup',
  templateUrl: './signupBand.component.html',
  styleUrls: ['./signupBand.component.css']
})
export class SignupBandComponent implements OnInit {

  @ViewChild(ImageUploadComponent)
  imageUpload: ImageUploadComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private musicService: MusicService
  ) {}

  private access_token: string;
  private refresh_token: string;
  private playlists: Playlist[] = [];

  ngOnInit() {
    this.musicService.getUserPlaylists().subscribe(response => {
        for (var i = 0; i < response.items.length; i++) {
          this.playlists.push({Name: response.items[i].name, TrackHref: response.items[i].tracks.href, TrackCount: response.items[i].tracks.total})
        }
    });
    var tokens: string[] = this.musicService.getTokens();
    this.access_token = tokens[0];
    this.refresh_token = tokens[1];
  }

  signupBandForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    profileImage: new FormControl('', [
      Validators.required,
      ImageUploadComponent.ImageValidator
    ]),
    radius: new FormControl('', []),
    playlist: new FormControl('', [Validators.required]),
  });

  signupBand() {
    const band: Band = {
      ProfileZip: this.signupBandForm.controls.zip.value,
      ProfileName: this.signupBandForm.controls.name.value,
      ProfileBiography: this.signupBandForm.controls.description.value,
      ProfilePictureUrl: '', // Gets added in authSvc
      SearchRadius: this.signupBandForm.controls.radius.value,
      Playlist: {Name: this.playlists.find(x => x.TrackHref === this.signupBandForm.controls.playlist.value).Name, TrackHref: this.signupBandForm.controls.playlist.value, TrackCount: this.playlists.find(x => x.TrackHref === this.signupBandForm.controls.playlist.value).TrackCount},
      Tracks: [],
      AccessToken: this.access_token,
      RefreshToken: this.refresh_token,
    };

    this.musicService.getPlaylistTracks(band.Playlist.TrackHref).subscribe(response => {
      for (var i = 0; i < response.items.length; i++) {
        if (i > 9) {
          break;
        }
        if (response.items[i].track.is_playable) {
          band.Tracks.push({Name: response.items[i].track.name, Preview: response.items[i].track.preview_url})
        }
      }

      this.authService
        .signupBand(
          this.signupBandForm.controls.email.value, this.signupBandForm.controls.password.value, band, this.imageUpload.CroppedImage
        )
        .then((res) => {
          this.authService.verification();
          this.router.navigate(['browse']);
        })
        .catch(error => {
          console.log(error);
          if (error.code === 'auth/weak-password') {
            this.snackBar.open('Your password is too short', 'close', {
              duration: 2000
            });
          }
          if (error.code === 'auth/invalid-email') {
            this.snackBar.open('Please enter a valid email address', 'close', {
              duration: 2000
            });
          }
          if (error.code === 'auth/email-already-in-use') {
            this.snackBar.open('This email is already taken', 'close', {
              duration: 2000
            });
          }
        });
    });
  }
}
