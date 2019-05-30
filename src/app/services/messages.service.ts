import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take, mergeMap } from 'rxjs/operators';
import { Conversation, Band, Message, Venue, Pitch } from '../models';
import { AuthService } from './auth.service';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(
    private afDatabase: AngularFirestore,
    private authSvc: AuthService
  ) {}

  sendMessage(convoId: string, msg: string, senderId: string, read?: boolean[]) {
    const message: Message = {
      createdAt: Date.now(),
      senderId,
      text: msg
    };
    return this.afDatabase
      .collection(`Conversations/${convoId}/Messages`)
      .add(message);
  }

  sendConsentToken(token: string) {
    const uid = this.authSvc.currentUserID;
    return this.authSvc.getUserType().toPromise().then(type => {
      if (type === 'band') {
        return this.afDatabase
          .collection('Artists')
          .doc(uid)
          .update({ messagingToken: token });
      } else {
        return this.afDatabase
          .collection('Venues')
          .doc(uid)
          .update({ messagingToken: token });
      }
    });
  }

  getNotificationSetting() {
    const uid = this.authSvc.currentUserID;
    return this.authSvc.getUserType().pipe(
      mergeMap(type => {
        if (type === 'band') {
          return this.afDatabase
            .collection('Artists')
            .doc(uid).get().pipe(
              map(user => {
                return user.data().messagingNotificationsEnabled;
              })
            );
        } else {
          return this.afDatabase
            .collection('Venues')
            .doc(uid).get().pipe(
              map(user => {
                return user.data().messagingNotificationsEnabled;
              })
            );
        }
      })
    );
  }

  toggleNotifications() {
    const uid = this.authSvc.currentUserID;
    return this.authSvc.getUserType().toPromise().then(type => {
      if (type === 'band') {
        return this.afDatabase
          .collection('Artists')
          .doc(uid).get().toPromise().then(user => {
            const isEnabled = user.data().messagingNotificationsEnabled;
            return user.ref.update({ messagingNotificationsEnabled: !isEnabled });
          });
      } else {
        return this.afDatabase
          .collection('Venues')
          .doc(uid)
          .get().toPromise().then(user => {
            const isEnabled = user.data().messagingNotificationsEnabled;
            return user.ref.update({ messagingNotificationsEnabled: !isEnabled });
          });
      }
    });
  }

  sendPitch(venueId: string, pitch: Pitch) {
    return this.afDatabase
      .doc(`Artists/${this.authSvc.currentUserID}`)
      .valueChanges()
      .pipe(
        map((artist: Band | {}) => {
          const band = artist as Band;
          const name = band.ProfileName;
          const conversation: Conversation = {
            members: [venueId, this.authSvc.currentUserID],
            pitchAccepted: false,
            pitch,
            lastMessage: {
              createdAt: firestore.Timestamp.fromDate(new Date()),
              text: 'New Pitch from ' + name
            }
          };
          return this.afDatabase.collection('Conversations').add(conversation);
        })
      );
  }

  getConversationsByUserId(userId: string) {
    return this.afDatabase
      .collection('Conversations', ref =>
        ref
          .where('members', 'array-contains', userId)
          .orderBy('lastMessage.createdAt', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map(snaps => {
          return snaps.map(snap => {
            return {
              id: snap.payload.doc.id,
              conversation: snap.payload.doc.data() as Conversation
            };
          });
        })
      );
  }

  getSenderDataById(userId: string) {
    return this.afDatabase
      .collection('Artists')
      .doc(userId)
      .get()
      .pipe(
        mergeMap(doc => {
          const type = doc.exists ? 'band' : 'venue';
          if (type === 'band') {
            return this.afDatabase
              .collection('Artists')
              .doc(userId)
              .valueChanges()
              .pipe(
                map((artist: Band) => {
                  if (!artist) {
                    return;
                  }
                  return {
                    id: userId,
                    profileUrl: artist.ProfilePictureUrl,
                    profileName: artist.ProfileName
                  };
                }),
                take(1)
              );
          } else {
            return this.afDatabase
              .collection('Venues')
              .doc(userId)
              .valueChanges()
              .pipe(
                map((venue: Venue) => {
                  if (!venue) {
                    return;
                  }
                  return {
                    id: userId,
                    profileUrl: venue.ProfilePictureUrl,
                    profileName: venue.ProfileName
                  };
                }),
                take(1)
              );
          }
        })
      );
  }

  getMessagesByConversationId(convoId: string) {
    return this.afDatabase
      .collection(`Conversations/${convoId}/Messages`, ref =>
        ref.orderBy('createdAt')
      )
      .valueChanges();
  }

  getConversationByConversationId(convoId: string) {
    return this.afDatabase
      .collection('Conversations')
      .doc(convoId)
      .valueChanges();
  }

  acceptPitch(convoId: string) {
    return this.afDatabase
      .collection('Conversations')
      .doc(convoId)
      .update({ pitchAccepted: true });
  }

  deleteConversation(convoId: string) {
    return this.afDatabase
      .collection('Conversations')
      .doc(convoId)
      .delete();
  }
}
