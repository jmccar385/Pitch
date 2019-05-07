import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private afMessaging: AngularFireMessaging,
    private msgSvc: MessagesService
  ) {}

  verified = false;

  ngOnInit() {
    this.verified = this.authService.currentUser.emailVerified;
  }

  consent() {
    this.afMessaging.requestToken
    .subscribe(token => this.msgSvc.sendConsentToken(token), console.log); // second log is for errors

    this.afMessaging.messages.subscribe(val => console.log('subscribed: ', val));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  verify() {
    this.authService.verification().then(() => {
      this.snackBar.open('A new email has been sent.', 'close', {
        duration: 2000
      });
    });
  }
}
