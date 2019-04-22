import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  private messages;

  constructor(private msgSvc: MessagesService, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.messages = this.msgSvc.getMessagesByConversationId()
    this.route.params.subscribe(params => this.messages = this.msgSvc.getMessagesByConversationId(params.id));
  }

}
