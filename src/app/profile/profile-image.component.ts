import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-profile-image-dialog',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css']
})

// tslint:disable-next-line: component-class-suffix
export class ProfileImageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProfileImageDialogComponent>,
  ) {}
}
