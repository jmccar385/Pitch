import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar, ) { }

  verified = false;

  ngOnInit() {
    this.verified = this.authService.currentUser.emailVerified;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  verify() {
    this.authService.verification().then(() => {
      this.snackBar.open('A new email has been sent.', 'close', {duration: 2000});
    });
  }
}
