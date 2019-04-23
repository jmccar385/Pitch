import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Conversation, Band } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(
    private afDatabase: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}

  getConversationsByUserId(userId: string) {
    return this.afDatabase
      .collection('Conversations', ref =>
        ref.where('members', 'array-contains', userId)
      )
      .snapshotChanges().pipe(
        map(snaps => {
          return snaps.map(snap => {
            return {id: snap.payload.doc.id, conversation: snap.payload.doc.data() as Conversation};
          });
        })
      );
  }

  getSenderDataById(userId: string) {
    return this.afDatabase.collection('Artists').doc(userId).valueChanges().pipe(
      map((artist: Band) => {
        return {profileUrl: artist.ProfilePictureUrl, profileName: artist.ProfileName};
      }),
      take(1)
    );
  }

  getMessagesByConversationId(convoId: string) {
    return this.afDatabase.collection(`Conversations/${convoId}/Messages`).valueChanges();
  }
}
