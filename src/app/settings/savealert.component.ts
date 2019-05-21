import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-save-alert-dialog',
  templateUrl: './savealert.component.html',
  styleUrls: ['./savealert.component.css']
})

// tslint:disable-next-line: component-class-suffix
export class SaveAlertDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SaveAlertDialogComponent>,
  ) {}
}
