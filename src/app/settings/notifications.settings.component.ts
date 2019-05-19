import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './notifications.settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class NotificationSettingsComponent implements OnInit {

  userType: string;

  constructor(private authService: AuthService, private headerSvc: HeaderService) {}

  ngOnInit() {
    this.userType = this.authService.userType;
    const startRouterlink = (this.userType === 'band') ?
    ['/profile', 'band', 'settings'] :
    ['/profile', 'venue', 'settings'];
    // Set header
    this.headerSvc.setHeader({
      title: 'Notifications',
      iconEnd: null,
      iconStart: 'arrow_back_ios',
      endRouterlink: null,
      startRouterlink
    });
  }
}
