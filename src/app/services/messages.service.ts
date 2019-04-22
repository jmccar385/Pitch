import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(
    private afDatabase: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}

  getConversationsByUserId(userId: string) {
    console.log(userId);
    return this.afDatabase
      .collection('Conversations', ref =>
        ref.where('members', 'array-contains', userId)
      )
      .snapshotChanges().pipe(
        map(snaps => {
          return snaps.map(snap => {
            console.log(snap);
            return {id: snap.payload.doc.id, conversation: snap.payload.doc.data()};
          });
        })
      );
  }

  getMessagesByConversationId(convoId: string) {
    return this.afDatabase.collection(`Conversation/${convoId}/Messages`);
  }
}
