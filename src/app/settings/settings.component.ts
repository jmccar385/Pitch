import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HeaderService } from '../services/header.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NewEmailDialogComponent } from './newemail.component';
import { SaveAlertDialogComponent } from './savealert.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { Observable } from 'rxjs';
import { Band, Venue } from '../models';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  verified = false;
  userEmail: string;
  settingsChange = false;
  profile: any;
  userType: string;
  startRouterlink;
  notificationsEnabled;

  constructor(
    private authService: AuthService,
    private msgService: MessagesService,
    private afMessaging: AngularFireMessaging,
    public dialog: MatDialog,
    private headerSvc: HeaderService,
    private snackBar: MatSnackBar,
    private router: Router,
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {}

  settingsForm: FormGroup = new FormGroup({
    radius: new FormControl()
  });

  ngOnInit() {
    this.userType = this.route.snapshot.params.userType;
    this.verified = this.authService.currentUser.emailVerified;
    this.userEmail = this.authService.currentUser.email;
    const iconEnd = 'power_settings_new';
    this.startRouterlink =
      this.userType === 'band'
        ? ['/profile', 'band', this.authService.currentUserID]
        : ['/profile', 'venue', this.authService.currentUserID];
    // Set header
    this.headerSvc.setHeader({
      title: 'Settings',
      iconEnd,
      iconStart: 'person',
      endRouterlink: null,
      startRouterlink: null
    });

    let profile$: Observable<Band | Venue>;
    if (this.userType === 'band') {
      profile$ = this.profileService.getArtistObserverById(
        this.authService.currentUserID
      ) as Observable<Band>;
    } else {
      profile$ = this.profileService.getVenueObserverById(
        this.authService.currentUserID
      ) as Observable<Venue>;
    }

    profile$.subscribe((profile: Band | Venue) => {
      if (this.userType === 'band') {
        this.profile = profile as Band;
        this.settingsForm.controls.radius.setValue(this.profile.SearchRadius);
        this.settingsChange = false;
      } else {
        this.profile = profile as Venue;
      }
    });
    this.settingsForm.valueChanges.subscribe(() => {
      this.settingsChange = true;
    });

    this.notificationsEnabled = this.msgService.getNotificationSetting();
  }

  goBack() {
    if (this.settingsChange) {
      const dialogRef = this.dialog.open(SaveAlertDialogComponent, {
        width: '450px',
        data: {},
        autoFocus: false
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.profileService.updateArtistById(
            this.authService.currentUserID,
            this.profile.ProfileAddress,
            this.profile.ProfileBiography,
            this.profile.Playlist,
            this.profile.Tracks,
            this.settingsForm.controls.radius.value
          ).then(() => this.router.navigate(this.startRouterlink));
        }
      });
    } else {
      this.router.navigate(this.startRouterlink);
    }
  }

  consent() {
    this.afMessaging.requestToken
    .subscribe(token => this.msgService.sendConsentToken(token));
    this.msgService.toggleNotifications();
  }

  signOut() {
    this.authService.logout().then(() => this.router.navigate(['/login']));
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
