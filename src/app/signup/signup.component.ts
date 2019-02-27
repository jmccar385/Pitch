import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	constructor(private router: Router, private authService: AuthService) { }

	ngOnInit() {
	}

	signup() {
		this.authService.signup(this.signupForm.controls.email.value, this.signupForm.controls.password.value).then(() => {
			this.authService.verification();
		});
	}

	signupForm: FormGroup = new FormGroup({
		email: new FormControl('', [
			Validators.required,
			Validators.email,
		]),
		password: new FormControl('', [
			Validators.required,
		])
	});

}
