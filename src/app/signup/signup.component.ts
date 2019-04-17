import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.code && params.state) {
        this.authService.authorizeSpotify(params.code, params.state).then(console.log);
      }
    });
  }

  spotifyAuthentication() {
    this.authService.requestAuthorizationSpotify().subscribe(console.log, data => {
      window.location.replace(data.url);
    });
  }
}
