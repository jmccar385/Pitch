import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AuthService } from '../services/auth.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'spotify-alert-dialog',
  templateUrl: './spotifyalert.component.html',
  styleUrls: ['./spotifyalert.component.css']
})

// tslint:disable-next-line: component-class-suffix
export class SpotifyAlertDialog {

  constructor(
    public dialogRef: MatDialogRef<SpotifyAlertDialog>,
    private authService: AuthService,
  ) {}

  continue() {
    this.authService.requestAuthorizationSpotify().subscribe(console.log, data => {
      window.location.replace(data.url);
    });
  }
}
