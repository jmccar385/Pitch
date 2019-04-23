import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  private messages;
  currentUserId: string;
  conversationId: string;
  text: string;

  constructor(private msgSvc: MessagesService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.currentUserId = this.authService.currentUserID;
    this.route.params.subscribe(params => {
      this.messages = this.msgSvc.getMessagesByConversationId(params.id);
      this.conversationId = params.id;
    });
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
