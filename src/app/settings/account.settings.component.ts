import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NewEmailDialogComponent } from './newemail.component';

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

  userType: string;
  verified = false;
  userEmail = '';

  ngOnInit() {
    this.userType = this.authService.userType;
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
