import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { ForgotPasswordDialog } from './forgotpassword.component';

@Component({
  	selector: 'app-login',
  	templateUrl: './login.component.html',
  	styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog, private authService: AuthService, private router: Router) { }

  forgotPassword(): void {
    const dialogRef = this.dialog.open(ForgotPasswordDialog, {width: '300px', data: {}});
	  dialogRef.afterClosed().subscribe(() => {
     this.snackBar.open("Please check your email to reset your password", "close", {duration: 2000,});
    });
  }

	login(): void {
      this.authService.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value).then((res) => {
        this.router.navigate(['browse']);
      }).catch((error) => {
        if (error.code == "auth/user-not-found") {
          this.snackBar.open("Your have entered an incorrect email or password", "close", {duration: 2000,});
        }
      });
	}

	loginForm: FormGroup = new FormGroup({
  	email: new FormControl('', [
  		Validators.required,
  		Validators.email,
  	]),

  	password: new FormControl('', [
  		Validators.required,
  	])
	});
}
