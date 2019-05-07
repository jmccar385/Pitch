import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NewEmailDialogComponent } from './newemail.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

@Component({
  selector: 'app-account-settings',
  templateUrl: './account.settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  verified = false;
  userEmail = '';

  ngOnInit() {
    this.verified = this.authService.currentUser.emailVerified;
    this.userEmail = this.authService.currentUser.email;
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


@Component({
  selector: 'app-account-settings',
  templateUrl: './notifications.settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class NotificationSettingsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
