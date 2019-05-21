import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HeaderService } from '../services/header.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NewEmailDialogComponent } from './newemail.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { Observable } from 'rxjs';
import { Band, Venue } from '../models';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  verified = false;
  userEmail: string;
  userType;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private headerSvc: HeaderService,
    private snackBar: MatSnackBar,
    private router: Router,
    private profileService: ProfileService
  ) {}

  settingsForm: FormGroup = new FormGroup({
    radius: new FormControl()
  });

  ngOnInit() {
    this.authService.getUserType().subscribe(type => {
      this.userType = type;
      this.verified = this.authService.currentUser.emailVerified;
      this.userEmail = this.authService.currentUser.email;
      const startRouterlink =
        this.userType === 'band'
          ? ['/profile', 'band', this.authService.currentUserID]
          : ['/profile', 'venue', this.authService.currentUserID];
      // Set header
      this.headerSvc.setHeader({
        title: 'Settings',
        iconEnd: null,
        iconStart: 'person',
        endRouterlink: null,
        startRouterlink
      });

      let profile$: Observable<Band | Venue>;
      if (this.userType === 'band') {
        profile$ = this.profileService.getArtistObserverById(this.authService.currentUserID) as Observable<Band>;
      } else {
        profile$ = this.profileService.getVenueObserverById(this.authService.currentUserID) as Observable<Venue>;
      }

      profile$.subscribe((profile: Band | Venue) => {
        if (this.userType === 'band') {
          profile = profile as Band;
          this.settingsForm.controls.radius.setValue(profile.SearchRadius);
        } else {
          profile = profile as Venue;
        }
      });
    });
  }

  delete() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('login');
    });
  }

  signOut() {
    this.authService.logout();
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
