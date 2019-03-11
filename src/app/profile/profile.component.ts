import { Component, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  ;

  constructor(public dialog: MatDialog,private router: Router) { 
    
  }
  ngOnInit() {
  }

  reviewModal(): void {
    const dialogRef = this.dialog.open(ReviewModalDialog, {width: '300px', data: {}});
    dialogRef.afterClosed().subscribe(result => {console.log('The dialog was closed');});
  }
}

@Component({
  selector: 'review-dialog',
  templateUrl: './review-dialog.html',
})
export class ReviewModalDialog {

  constructor(public dialogRef: MatDialogRef<ReviewModalDialog>) {}

	reviewModalForm: FormGroup = new FormGroup({
  	email: new FormControl('', [
  		Validators.required,
    	]),
	});

  send(): void {
    this.dialogRef.close();
  }
}