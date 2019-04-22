import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";
import { MessagesService } from '../services/messages.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Conversation } from '../models';

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
    private messagesService: MessagesService
  ) { }

  imageSrc = "https://scontent.fphl2-1.fna.fbcdn.net/v/t1.0-9/16196015_10154888128487744_6901111466535510271_n.png?_nc_cat=103&_nc_ht=scontent.fphl2-1.fna&oh=ee2b450ecab420965220c04897ab03da&oe=5D43E7E9";
  interlocutor = "Jon Snow";

  private conversationItems: Observable<any>;
  ngOnInit() {
    this.currentUserId = this.authService.currentUserID;
    this.conversationItems = this.messagesService.getConversationsByUserId(this.currentUserId).pipe(
      tap(console.log)
    );
  }
}
