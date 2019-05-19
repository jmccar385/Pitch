import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  userType: string;
  constructor(
    private authService: AuthService,
    private router: Router,
    private headerSvc: HeaderService
  ) {}

  ngOnInit() {
    this.userType = this.authService.userType;
    const startRouterlink = (this.userType === 'band') ?
    ['/profile', 'band', this.authService.currentUserID] :
    ['/profile', 'venue', this.authService.currentUserID];
    // Set header
    this.headerSvc.setHeader({
      title: 'Settings',
      iconEnd: null,
      iconStart: 'person',
      endRouterlink: null,
      startRouterlink
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
