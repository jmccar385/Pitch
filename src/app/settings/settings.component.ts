import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private authService: AuthService) { }

  verified: boolean = false;

  ngOnInit() {
  	this.verified = this.authService.currentUser.emailVerified;
  }
}
