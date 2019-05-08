import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  userType: string;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userType = this.authService.userType;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
