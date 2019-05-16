import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { MessagesService } from '../services/messages.service';
import { Observable, from, of, zip, merge } from 'rxjs';
import { mergeMap, map, tap, withLatestFrom, toArray, take } from 'rxjs/operators';
import { AcceptanceModalComponent } from '../acceptance-modal/acceptance-modal.component';
import { MatDialog } from '@angular/material';
import { Conversation, Band } from '../models';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  currentUserId: string;
  private band: Band;
  //profileImageUrls: string[];
  currentUserType: string;


  constructor(
    private router: Router,
    private authService: AuthService,
    private messagesService: MessagesService,
    public dialog: MatDialog,
    private profileService: ProfileService,
    private afStore: AngularFirestore
  ) { }

  private conversationItems: Observable<any>;
  ngOnInit() {
    this.currentUserId = this.authService.currentUserID;
    this.currentUserType = this.authService.userType;
    this.authService.currentUserObservable.pipe(
      map(user => {
        return this.afStore.doc(`Artists/${user.uid}`).get()
      })
    ).subscribe(doc => {
      console.log('up in this bitch')
      //const type = doc.exists ? 'band' : 'venue';
      //console.log('this type: ', type)
    })
    console.log(this.currentUserId);
    console.log(this.currentUserType);

    const getSenderDataByConvo = convo => {
      const id = convo.conversation.members.filter(i => {
        if (i !== this.currentUserId) {
          return i;
        }
      })[0];
      return zip(from([convo]), this.messagesService.getSenderDataById(id));
    };

    const zipConvoData = (UrlConvo) => {
      return { ...UrlConvo[0], senderData: UrlConvo[1] };
    };

    this.conversationItems = this.messagesService
      .getConversationsByUserId(this.currentUserId)
      .pipe(
        mergeMap(array => {
          const convosObservable = from(array);
          return convosObservable.pipe(
            mergeMap(getSenderDataByConvo),
            // withLatestFrom(convosObservable),
            map(zipConvoData),
            toArray()
          )
        }),
        tap(console.log));
    // this.conversationItems.subscribe(item => console.log(item));
  }

  viewPitch(convoId: string) {
    this.messagesService.getConversationByConversationId(convoId).pipe(
      mergeMap((convo: any) => {
        console.log('convoId: ', convoId);
        const id = convo.members.filter(i => {
          if (i !== this.currentUserId) {
            return i;
          }
        });

        return this.profileService.getArtistObserverById(id[0]).pipe(
          map((artist: Band) => {
            //this.profileImageUrls = artist.ProfileImageUrls;
            this.band = artist;
            this.dialog.open(AcceptanceModalComponent, {
              width: '90%',
              maxWidth: '100vw',
              height: '90%',
              autoFocus: false,
              data: { convoId: convoId, convo, bandId: id, band: this.band  }
            });
          })
        );

      }),
      take(1)
    ).subscribe();
  }

}