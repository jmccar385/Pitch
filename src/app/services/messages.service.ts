import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take, mergeMap } from 'rxjs/operators';
import { Conversation, Band, Message, Venue } from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(
    private afDatabase: AngularFirestore,
    private authSvc: AuthService
  ) {}

  sendMessage(convoId: string, msg: string) {
    const message: Message = {
      createdAt: Date.now(),
      senderId: this.authSvc.currentUserID,
      text: msg
    };
    return this.afDatabase.collection(`Conversations/${convoId}/Messages`).add(message);
  }

  getConversationsByUserId(userId: string) {
    return this.afDatabase
      .collection('Conversations', ref =>
        ref.where('members', 'array-contains', userId).orderBy('lastMessage.createdAt', 'desc')
      )
      .snapshotChanges().pipe(
        map(snaps => {
          return snaps.map(snap => {
            return {id: snap.payload.doc.id, conversation: snap.payload.doc.data() as Conversation};
          });
        })
      );
  }

  // getSenderDataById(userId: string) {
  //   return this.afDatabase.collection('Artists').doc(userId).valueChanges().pipe(
  //     map((artist: Band) => {
  //       return {profileUrl: artist.ProfilePictureUrl, profileName: artist.ProfileName};
  //     }),
  //     take(1)
  //   );
  // }

  getSenderDataById(userId: string) {
    return this.afDatabase.collection('Artists').doc(userId).get().pipe(
      mergeMap(doc => {
        const type = doc.exists ? 'band' : 'venue';
        console.log(type);
        if (type === 'band') {
          console.log(1);
          return this.afDatabase.collection('Artists').doc(userId).valueChanges().pipe(
            map((artist: Band) => {
              return {profileUrl: artist.ProfilePictureUrl, profileName: artist.ProfileName};
            }),
            take(1)
          );
        } else {
          console.log(2);
          return this.afDatabase.collection('Venues').doc(userId).valueChanges().pipe(
            map((venue: Venue) => {
              console.log(venue.ProfilePictureUrl);
              return {profileUrl: venue.ProfilePictureUrl, profileName: venue.ProfileName};
            }),
            take(1)
          );
        }
      })
    );
  }

  getMessagesByConversationId(convoId: string) {
    return this.afDatabase.collection(`Conversations/${convoId}/Messages`, ref => ref.orderBy('createdAt')).valueChanges();
  }

  getConversationByConversationId(convoId: string) {
    return this.afDatabase.collection('Conversations').doc(convoId).valueChanges();
  }
}