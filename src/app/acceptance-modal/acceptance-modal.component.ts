import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AcceptanceDialogData } from '../models';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-acceptance-modal',
  templateUrl: './acceptance-modal.component.html',
  styleUrls: ['./acceptance-modal.component.css']
})
export class AcceptanceModalComponent {
  slideIndex = 1;

  constructor(
    public dialogRef: MatDialogRef<AcceptanceModalComponent>,
    private msgSvc: MessagesService,
    @Inject(MAT_DIALOG_DATA) public data: AcceptanceDialogData
  ) { }

  async accept() {
    await this.msgSvc.acceptPitch(this.data.convoId);
    this.msgSvc.sendMessage(this.data.convoId, this.data.convo.pitch.message, this.data.bandId);
    this.dialogRef.close();
  }

  decline() {
    this.msgSvc.deleteConversation(this.data.convoId);
    this.dialogRef.close();
  }

  changeSlideBy(delta) {
    this.showSlides((this.slideIndex += delta));
  }

  jumpToSlide(target) {
    this.showSlides((this.slideIndex = target + 1));
  }

  showSlides(index) {
    const slides = document.getElementsByClassName('slide-image');

    if (slides.length === 0) {
      return;
    }

    if (index > slides.length) {
      this.slideIndex = 1;
    }
    if (index < 1) {
      this.slideIndex = slides.length;
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < slides.length; i++) {
      slides[i].className = slides[i].className.replace(' slide-active', '');
    }

    slides[this.slideIndex - 1].className += ' slide-active';
  }

}
