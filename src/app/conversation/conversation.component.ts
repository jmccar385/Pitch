import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  private messages;
  currentUserId: string;

  constructor(private msgSvc: MessagesService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.currentUserId = this.authService.currentUserID;
    // this.messages = this.msgSvc.getMessagesByConversationId()
    this.route.params.subscribe(params => this.messages = this.msgSvc.getMessagesByConversationId(params.id).pipe(
      tap(console.log)
    ));
  }

}
