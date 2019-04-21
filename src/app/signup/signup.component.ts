import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MusicService } from '../services/music.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  constructor(
  	private authService: AuthService,
  	private musicService: MusicService, 
  	private route: ActivatedRoute,
  	private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.code && params.state) {
        this.authService.authorizeSpotify(params.code, params.state).then(data => {
        	this.musicService.setTokens(data.access_token, data.refresh_token);
        	this.router.navigateByUrl('signup/band');
        });
      }
    });
  }

  spotifyAuthentication() {
    this.authService.requestAuthorizationSpotify().subscribe(console.log, data => {
      window.location.replace(data.url);
    });
  }
}
