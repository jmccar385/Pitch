import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NewEmailDialogComponent } from './newemail.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  userType: string;
  verified = false;
  userEmail = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  settingsForm: FormGroup = new FormGroup({
    radius: new FormControl(),
  });

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
