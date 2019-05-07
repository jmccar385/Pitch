import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-pitch-dialog',
  templateUrl: './pitch.component.html',
  styleUrls: ['./pitch.component.css']
})

export class PitchDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PitchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PitchDialogComponent
  ) {}

  reviewForm: FormGroup = new FormGroup({
    pitch: new FormControl('', [
      Validators.required,
      Validators.max(200),
    ]),
    tracks: new FormControl('', [
      Validators.required,
    ]),
    events: new FormControl('', {})
  });

  review(): void {
    this.dialogRef.close();
  }
}
