import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'review-dialog',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})

export class ReviewDialog {

  constructor(public dialogRef: MatDialogRef<ReviewDialog>) {}

	reviewForm: FormGroup = new FormGroup({
  	rating: new FormControl('', [
  		Validators.required,
      Validators.max(5),
      Validators.min(0),
    ]),
    review: new FormControl('', [
      Validators.required,
    ]),
	});

  review(): void {
    this.dialogRef.close();
  }
}