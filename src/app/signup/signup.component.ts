import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MusicService } from '../services/music.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

	constructor(private router: Router, private authService: AuthService, private musicService: MusicService, private snackBar: MatSnackBar) { }

	spotifyAuthentication() {
		this.musicService.authenticateWithSpotify();
	}
}
