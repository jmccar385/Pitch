import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { mergeMap, map, tap, take, switchMap } from 'rxjs/operators';
import { Band, Venue } from '../models';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(
    private authSvc: AuthService,
    private afDatabase: AngularFirestore,
    private afMessaging: AngularFireMessaging
  ) {}

  hasConsent() {
    const uid = this.authSvc.currentUserID;
    return this.authSvc.getUserType().pipe(
      mergeMap(type => {
        const profileCollection = type === 'band' ? 'Artists' : 'Venues';
        return this.afDatabase
          .doc(`${profileCollection}/${uid}`)
          .valueChanges()
          .pipe(map((user: Band | Venue) => user.MessagingToken));
      })
    );
  }

  sendConsentToken(token: string) {
    const uid = this.authSvc.currentUserID;
    return this.authSvc
      .getUserType()
      .toPromise()
      .then(type => {
        if (type === 'band') {
          return this.afDatabase
            .collection('Artists')
            .doc(uid)
            .update({ MessagingToken: token });
        } else {
          return this.afDatabase
            .collection('Venues')
            .doc(uid)
            .update({ MessagingToken: token });
        }
      });
  }

  getNotificationSettings(notifications: any[]) {
    const uid = this.authSvc.currentUserID;
    return this.authSvc.getUserType().pipe(
      mergeMap(type => {
        if (type === 'band') {
          return this.afDatabase
            .collection('Artists')
            .doc(uid)
            .get()
            .pipe(
              map(user => {
                return notifications.map(noti => {
                  return {
                    ...noti,
                    value: user.data().notificationSettings[noti.type]
                  };
                });
              })
            );
        } else {
          return this.afDatabase
            .collection('Venues')
            .doc(uid)
            .get()
            .pipe(
              map(user => {
                return notifications.map(noti => {
                  return {
                    ...noti,
                    value: user.data().notificationSettings[noti.type]
                  };
                });
              })
            );
        }
      })
    );
  }

  toggleNotifications(notification: string) {
    this.hasConsent().pipe(
      mergeMap(consent => {
        if (!consent) {
          return this.afMessaging.requestToken.pipe(
            mergeMap(token => this.sendConsentToken(token))
          );
        }
        const uid = this.authSvc.currentUserID;
        return this.authSvc.getUserType().pipe(
          mergeMap(type => {
            if (type === 'band') {
              return this.afDatabase
                .collection('Artists')
                .doc(uid)
                .get()
                .pipe(
                  map(user => {
                    const isEnabled = user.data().notificationSettings.notification;
                    user.ref.update({
                      notificationSettings: {
                        notification: !isEnabled
                      }
                    });
                  })
                );
            } else {
              return this.afDatabase
                .collection('Venues')
                .doc(uid)
                .get()
                .pipe(
                  map(user => {
                    const isEnabled = user.data().notificationSettings[notification];
                    user.ref.set({
                      notificationSettings: {
                        [notification]: !isEnabled
                      }
                    }, {merge: true});
                  })
                );
            }
          })
        );
      }),
      take(1)
    ).subscribe();
  }
}
