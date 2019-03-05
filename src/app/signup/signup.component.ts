import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	constructor(private router: Router, private authService: AuthService, private snackBar: MatSnackBar) { }

	ngOnInit() {
	}

	signup() {
		this.authService.signup(this.signupForm.controls.email.value, this.signupForm.controls.password.value).then(() => {
			this.authService.verification();
		}).catch((error) => {
			console.log(error);
			if (error.code == "auth/weak-password") {
				this.snackBar.open("Your password is too short", "close", {duration: 2000});
			}
			if (error.code == "auth/invalid-email") {
				this.snackBar.open("Please enter a valid email address", "close", {duration: 2000});
			}
			if (error.code == "auth/email-already-in-use") {
				this.snackBar.open("This email is already taken", "close", {duration: 2000});
			}
		});
	}

	signupForm: FormGroup = new FormGroup({
		email: new FormControl('', [
			Validators.required,
			Validators.email,
		]),
		password: new FormControl('', [
			Validators.required,
		]),
		bandAddress: new FormControl('', [
			Validators.required,
		]),
		venueAddress: new FormControl('', [
			Validators.required,
		]),
		venueName: new FormControl('', [
			Validators.required,
		]),
		bandName: new FormControl('', [
			Validators.required,
		])
	});

}
