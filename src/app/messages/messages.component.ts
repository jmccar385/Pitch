import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { MessagesService } from '../services/messages.service';
import { Observable, from, zip } from 'rxjs';
import { mergeMap, map, toArray, take } from 'rxjs/operators';
import { AcceptanceModalComponent } from '../acceptance-modal/acceptance-modal.component';
import { MatDialog } from '@angular/material';
import { Band } from '../models';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  currentUserId: string;
  currentUserType: string;
  private band: Band;
  private conversationItems: Observable<any>;

  constructor(
    private authService: AuthService,
    private headerSvc: HeaderService,
    private messagesService: MessagesService,
    public dialog: MatDialog,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.currentUserID;
    this.authService.getUserType().subscribe(type => {
      this.currentUserType = type;
      const iconEnd = this.currentUserType === 'band' ? 'list' : 'person';
      const endRouterlink =
        this.currentUserType === 'band'
          ? ['/browse']
          : ['/profile/' + this.currentUserType + '/' + this.currentUserId];

      // Set header
      this.headerSvc.setHeader({
        title: 'Messages',
        iconEnd,
        iconStart: null,
        endRouterlink,
        startRouterlink: null
      });

      const getSenderDataByConvo = convo => {
        const id = convo.conversation.members.filter(i => {
          if (i !== this.currentUserId) {
            return i;
          }
        })[0];
        return zip(from([convo]), this.messagesService.getSenderDataById(id));
      };

      const zipConvoData = UrlConvo => {
        return { ...UrlConvo[0], senderData: UrlConvo[1] };
      };

      this.conversationItems = this.messagesService
        .getConversationsByUserId(this.currentUserId)
        .pipe(
          mergeMap(array => {
            const convosObservable = from(array);
            return convosObservable.pipe(
              mergeMap(getSenderDataByConvo),
              map(zipConvoData),
              toArray()
            );
          })
        );
    });
  }

  viewPitch(convoId: string) {
    this.messagesService
      .getConversationByConversationId(convoId)
      .pipe(
        mergeMap((convo: any) => {
          const id = convo.members.filter(i => {
            if (i !== this.currentUserId) {
              return i;
            }
          });

          return this.profileService.getArtistObserverById(id[0]).pipe(
            map((artist: Band) => {
              this.band = artist;
              this.band.ProfileImageUrls.push(this.band.ProfilePictureUrl);
              this.dialog.open(AcceptanceModalComponent, {
                width: '90%',
                maxWidth: '100vw',
                height: '90%',
                autoFocus: false,
                data: { convoId: convoId, convo: convo, bandId: id.toString(), band: this.band }
              });
            })
          );
        }),
        take(1)
      )
      .subscribe();
  }
}
