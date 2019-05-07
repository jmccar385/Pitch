import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { Band, Venue } from '../models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() profile: Band|Venue;
  @Input() userType: string;
  @Input() view: boolean;
  @Input() seeView: boolean;

  constructor(private router: Router, private authService: AuthService, private snackBar: MatSnackBar) { }

  private id: string;

  ngOnInit() {
    this.id = this.authService.currentUserID;
  }

  verified(): void {
    if (!this.authService.currentUser.emailVerified) {
      this.snackBar.open('Please verify your email first. See settings.', 'close', {duration: 2000});
    } else {
      if (this.userType === 'venue') {
        this.router.navigate(['/messages']);
      } else {
        this.router.navigate(['/browse']);
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
