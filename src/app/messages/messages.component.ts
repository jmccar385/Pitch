import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { MessagesService } from '../services/messages.service';
import { Observable, from, of, zip } from 'rxjs';
import { mergeMap, map, tap, withLatestFrom, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  currentUserId: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private messagesService: MessagesService,
  ) {}

  private conversationItems: Observable<any>;
  ngOnInit() {
    this.currentUserId = this.authService.currentUserID;

    const getSenderDataByConvo = element => {
      const id = element.conversation.members.filter(i => {
        if (i != this.currentUserId) {
          return i;
        }
      })[0];
      return this.messagesService.getSenderDataById(id);
    };

    const zipConvoData = (UrlConvo) => {
      return {...UrlConvo[1], senderData: UrlConvo[0]};
    };

    this.conversationItems = this.messagesService
      .getConversationsByUserId(this.currentUserId)
      .pipe(
        mergeMap(array => from(array).pipe(
          mergeMap(getSenderDataByConvo),
          withLatestFrom(array),
          map(zipConvoData),
          toArray()
        )));
    this.conversationItems.subscribe(item => console.log(item));
  }
}
