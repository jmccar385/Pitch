import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './notifications.settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class NotificationSettingsComponent implements OnInit {

  userType: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userType = this.authService.userType;
  }
}
