import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'spotify-alert-dialog',
  templateUrl: './spotifyalert.component.html',
  styleUrls: ['./spotifyalert.component.css']
})

export class SpotifyAlertDialog {

  constructor(
    public dialogRef: MatDialogRef<SpotifyAlertDialog>, 
    private router: Router, 
    private authService: AuthService,
  ) {}

  continue() {
    this.authService.requestAuthorizationSpotify().subscribe(console.log, data => {
      window.location.replace(data.url);
    });
  }
}