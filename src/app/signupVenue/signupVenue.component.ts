import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

@Component({
  selector: 'venue-signup',
  templateUrl: './signupVenue.component.html',
  styleUrls: ['./signupVenue.component.css']
})
export class SignupVenueComponent {

	constructor(private router: Router, private authService: AuthService, private snackBar: MatSnackBar) { }

	// signupVenue() {
	// 	this.authService.signup(this.signupVenueForm.controls.email.value, this.signupVenueForm.controls.password.value).then(() => {
	// 		this.authService.verification();
	// 		this.router.navigate(['browse']);
	// 	}).catch((error) => {
	// 		console.log(error);
	// 		if (error.code == "auth/weak-password") {
	// 			this.snackBar.open("Your password is too short", "close", {duration: 2000});
	// 		}
	// 		if (error.code == "auth/invalid-email") {
	// 			this.snackBar.open("Please enter a valid email address", "close", {duration: 2000});
	// 		}
	// 		if (error.code == "auth/email-already-in-use") {
	// 			this.snackBar.open("This email is already taken", "close", {duration: 2000});
	// 		}
	// 	});
	// }

	signupVenueForm: FormGroup = new FormGroup({
		email: new FormControl('', [
			Validators.required,
			Validators.email,
		]),
		password: new FormControl('', [
			Validators.required,
		]),
		address: new FormControl('', [
			Validators.required,
		]),
		city: new FormControl('', [
			Validators.required,
		]),
		state: new FormControl('', [
			Validators.required,
		]),
		zip: new FormControl('', [
			Validators.required,
		]),
		name: new FormControl('', [
			Validators.required,
		]),
		description: new FormControl('', [
			Validators.required,
		]),
		profileImage: new FormControl('', [
			Validators.required,
			ImageUploadComponent.ImageValidator,
		]),
	});

}