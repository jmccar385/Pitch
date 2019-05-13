import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-spotify-alert-dialog',
  templateUrl: './spotifyalert.component.html',
  styleUrls: ['./spotifyalert.component.css']
})

// tslint:disable-next-line: component-class-suffix
export class SpotifyAlertDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SpotifyAlertDialogComponent>,
    private authService: AuthService,
  ) {}

  continue() {
    this.authService.requestAuthorizationSpotify().subscribe(console.log, data => {
      window.location.replace(data.url);
    });
  }
}
