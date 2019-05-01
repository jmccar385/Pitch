import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
//import { currentId } from 'async_hooks';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  messages;
  currentUserId: string;
  conversationId: string;
  text: string;
  currentUserData: any;
  correspondentId: string;
  correspondentData: any;
  conversationData: any;

  constructor(
    private msgSvc: MessagesService, 
    private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit() {
    this.currentUserId = this.authService.currentUserID;
    this.route.params.subscribe(params => {
      this.messages = this.msgSvc.getMessagesByConversationId(params.id);
      this.conversationId = params.id;
    });
    this.msgSvc.getSenderDataById(this.currentUserId).subscribe((data) => {
      this.currentUserData = data;
    });
    this.conversationData = this.msgSvc.getConversationByConversationId(this.conversationId);
    this.conversationData.subscribe(
      element => {
        const id = element.members.filter(i => {
          if (i != this.currentUserId) {
            this.correspondentId = i;
            this.msgSvc.getSenderDataById(this.correspondentId).subscribe((data) => {
              this.correspondentData = data;
            });
          }
        })[0];
      }
    );
  }

  sendMessage() {
    console.log(this.text);
    this.msgSvc.sendMessage(this.conversationId, this.text).then(() => {
      this.text = '';
    }).catch(err => {
      console.log(err);
    });
  }

}
