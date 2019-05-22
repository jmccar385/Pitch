import {
  Component,
  OnInit,
  AfterViewChecked,
  ElementRef,
  ViewChild
} from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  private messages: any;
  currentUserId: string;
  conversationId: string;
  text: string;
  currentUserData: any;
  correspondentId: string;
  correspondentData: any;
  conversationData: any;
  conversationRead: boolean[];
  members: string[];

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollIntoView(false);
    } catch (err) {}
  }

  constructor(
    private msgSvc: MessagesService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private headerSvc: HeaderService
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.currentUserID;
    this.route.params.subscribe(params => {
      this.messages = this.msgSvc.getMessagesByConversationId(params.id);
      this.conversationId = params.id;
    });

    // Set header
    this.headerSvc.setHeader({
      title: 'Messages',
      iconEnd: null,
      iconStart: 'forum',
      endRouterlink: null,
      startRouterlink: ['/messages']
    });

    this.msgSvc.getSenderDataById(this.currentUserId).subscribe(data => {
      this.currentUserData = data;
    });
    this.conversationData = this.msgSvc.getConversationByConversationId(
      this.conversationId
    );

    this.conversationData.subscribe(element => {
      this.conversationRead = element.ConversationRead;
      this.members = element.members;
      const id = element.members.filter(i => {
        if (i !== this.currentUserId) {
          this.correspondentId = i;
          this.msgSvc
            .getSenderDataById(this.correspondentId)
            .subscribe(data => {
              this.correspondentData = data;
            });
        }
      })[0];
    });
    this.scrollToBottom();
  }

  sendMessage() {
    this.conversationRead[this.members.indexOf(this.correspondentId)] = false;
    this.msgSvc
      .sendMessage(this.conversationId, this.text, this.authService.currentUserID, this.conversationRead)
      .then(() => {
        this.text = '';
      })
      .catch(err => {
        console.log(err);
      });
  }
}
