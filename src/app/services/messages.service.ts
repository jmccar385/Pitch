import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { flatten } from '@angular/compiler';
import { Conversation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private afDatabase: AngularFirestore,
    private afStorage: AngularFireStorage   
  ) { }
  
  getConversationsByUserId(userId: string){
    console.log(userId);
    return this.afDatabase
    .collection('Conversations', ref => ref.where('members', 'array-contains', userId))
    .valueChanges();
  }



}
