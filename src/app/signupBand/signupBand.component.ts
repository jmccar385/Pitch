import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { Band } from '../models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'band-signup',
  templateUrl: './signupBand.component.html',
  styleUrls: ['./signupBand.component.css']
})
export class SignupBandComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  signupBandForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    // profileImage: new FormControl('', [
    //   Validators.required,
    //   ImageUploadComponent.ImageValidator
    // ]),
    profileImage: new FormControl(''),
    radius: new FormControl('', [])
  });

  signupBand() {
    const band: Band = {
      address: this.signupBandForm.controls.address.value,
      city: this.signupBandForm.controls.city.value,
      state: this.signupBandForm.controls.state.value,
      zip: this.signupBandForm.controls.zip.value,
      name: this.signupBandForm.controls.name.value,
      description: this.signupBandForm.controls.description.value,
      profileImage: this.signupBandForm.controls.profileImage.value,
      radius: this.signupBandForm.controls.radius.value
    };

    this.authService
      .signup(
        this.signupBandForm.controls.email.value, this.signupBandForm.controls.password.value, band
      )
      .then(() => {
        this.authService.verification();
        this.router.navigate(['browse']);
      })
      .catch(error => {
        console.log(error);
        if (error.code === 'auth/weak-password') {
          this.snackBar.open('Your password is too short', 'close', {
            duration: 2000
          });
        }
        if (error.code === 'auth/invalid-email') {
          this.snackBar.open('Please enter a valid email address', 'close', {
            duration: 2000
          });
        }
        if (error.code === 'auth/email-already-in-use') {
          this.snackBar.open('This email is already taken', 'close', {
            duration: 2000
          });
        }
      });
  }
}
