import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'pitch-dialog',
  templateUrl: './pitch.component.html',
  styleUrls: ['./pitch.component.css']
})

export class PitchDialog {

  constructor(public dialogRef: MatDialogRef<PitchDialog>) {}

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