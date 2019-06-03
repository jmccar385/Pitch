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

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private musicService: MusicService
  ) {}
  @ViewChild(ImageUploadComponent)
  imageUpload: ImageUploadComponent;

  accessToken: string;
  refreshToken: string;
  playlists: Playlist[] = [];
  loading = false;

  signupBandForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required,  Validators.maxLength(5)]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(1000)
    ]),
    profileImage: new FormControl('', [
      Validators.required,
      ImageUploadComponent.ImageValidator
    ]),
    radius: new FormControl('', []),
    playlist: new FormControl('', [Validators.required])
  });

  ngOnInit() {
    this.musicService.getUserPlaylists().then(response => {
      for (const item of response.items) {
        this.playlists.push({
          Name: item.name,
          TrackHref: item.tracks.href,
          TrackCount: item.tracks.total
        });
      }
    });
    const tokens: string[] = this.musicService.getTokens();
    this.accessToken = tokens[0];
    this.refreshToken = tokens[1];
  }

  signupBand() {
    this.loading = true;
    const PlaylistName = this.playlists.find(x => x.TrackHref === this.signupBandForm.controls.playlist.value).Name;
    const band: Band = {
      ProfileAddress: this.signupBandForm.controls.zip.value,
      ProfileName: this.signupBandForm.controls.name.value,
      ProfileBiography: this.signupBandForm.controls.description.value,
      ProfilePictureUrl: '', // Gets added in authSvc
      ProfileImageUrls: [],
      SearchRadius: this.signupBandForm.controls.radius.value,
      Playlist: {Name: PlaylistName, TrackHref: this.signupBandForm.controls.playlist.value, TrackCount: 0},
      Tracks: [],
      AccessToken: this.accessToken,
      RefreshToken: this.refreshToken,
      ProfileRating: 5,
      ProfileRatingCount: 1,
      ProfileReportCount: 0,
    };

    this.musicService.getPlaylistTracks(band.Playlist.TrackHref).subscribe(response => {
      for (let i = 0; i < response.items.length; i++) {
        if (i > 9) {
          break;
        }
        band.Tracks.push({Name: response.items[i].track.name, Preview: response.items[i].track.preview_url});
      }

      band.Playlist.TrackCount = band.Tracks.length;

      this.authService
        .signupBand(
          this.signupBandForm.controls.email.value, this.signupBandForm.controls.password.value, band, this.imageUpload.CroppedImage
        )
        .then((res) => {
          this.authService.verification();
          this.musicService.setSpotifyTokens();
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
