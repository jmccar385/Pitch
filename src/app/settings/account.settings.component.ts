import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NewEmailDialogComponent } from './newemail.component';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account.settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private headerSvc: HeaderService
  ) {}

  userType: string;
  verified = false;
  userEmail = '';

  ngOnInit() {
    this.userType = this.authService.userType;
    this.verified = this.authService.currentUser.emailVerified;
    this.userEmail = this.authService.currentUser.email;

    const startRouterlink = (this.userType === 'band') ?
    ['/profile', 'band', 'settings'] :
    ['/profile', 'venue', 'settings'];
    // Set header
    this.headerSvc.setHeader({
      title: 'Settings',
      iconEnd: null,
      iconStart: 'arrow_back_ios',
      endRouterlink: null,
      startRouterlink
    });
  }

  delete(): void {
    // Todo: delete account
  }

  verifyEmail() {
    this.authService.verification().then(() => {
      this.snackBar.open('A new email has been sent.', 'close', {
        duration: 2000
      });
    });
  }

  changeEmail() {
    this.dialog.open(NewEmailDialogComponent, {
      width: '450px',
      data: {}
    });
  }
}
