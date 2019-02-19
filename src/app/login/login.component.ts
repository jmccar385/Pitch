import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatSnackBar} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  	selector: 'app-login',
  	templateUrl: './login.component.html',
  	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  	constructor(private snackBar: MatSnackBar, public dialog: MatDialog) {}

  	ngOnInit() {
  	}

  	forgotPassword(): void {
    	const dialogRef = this.dialog.open(ForgotPasswordDialog, {width: '300px', data: {}});
		dialogRef.afterClosed().subscribe(result => {console.log('The dialog was closed');});
	}

  	login(): void {
  		if (this.loginForm.controls.userType.value == '') {
  			this.snackBar.open('Please select either Band or Venue above.', 'Close', {duration: 3000,});
  		}

  		if (this.loginForm.valid) {
  			console.log('login');
  			this.snackBar.dismiss();
  		}
  	}

  	loginForm: FormGroup = new FormGroup({
	  	email: new FormControl('', [
	  		Validators.required,
	  		Validators.email,
	  	]),

	  	password: new FormControl('', [
	  		Validators.required,
	  	]),

	  	userType: new FormControl('', [
	  		Validators.required,
	  	])
	});
}

@Component({
  selector: 'forgot-password-dialog',
  templateUrl: 'forgot-password-dialog.html',
})

export class ForgotPasswordDialog {

  	constructor(public dialogRef: MatDialogRef<ForgotPasswordDialog>) {}

  	forgotPasswordForm: FormGroup = new FormGroup({
	  	email: new FormControl('', [
	  		Validators.required,
	  		Validators.email,
	  	]),
	});

	send(): void {
    	this.dialogRef.close();
  	}
}
