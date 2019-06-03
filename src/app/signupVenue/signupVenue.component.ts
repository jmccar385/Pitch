import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { Venue, Equipment } from '../models';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'venue-signup',
  templateUrl: './signupVenue.component.html',
  styleUrls: ['./signupVenue.component.css']
})
export class SignupVenueComponent {
    signupVenueForm: FormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
      profileImage: new FormControl('', [
        Validators.required,
        ImageUploadComponent.ImageValidator
      ])
    });

  equipment: Observable<Array<{}>>;
  availableEquipment: Equipment[] = [];
  loading = false;

  @ViewChild(ImageUploadComponent)
  imageUpload: ImageUploadComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private firestore: AngularFirestore
  ) {
    this.equipment = this.firestore.collection('Equipment').valueChanges();
  }

  select(equip) {
    this.availableEquipment.includes(equip)
      ? this.availableEquipment.splice(this.availableEquipment.indexOf(equip))
      : this.availableEquipment.push(equip);
  }

  signupVenue() {
    this.loading = true;
    const venue: Venue = {
      // tslint:disable-next-line: max-line-length
      ProfileAddress: this.signupVenueForm.controls.address.value + ', ' + this.signupVenueForm.controls.city.value + ', ' + this.signupVenueForm.controls.state.value + ' ' + this.signupVenueForm.controls.zip.value,
      ProfileName: this.signupVenueForm.controls.name.value,
      ProfileBiography: this.signupVenueForm.controls.description.value,
      ProfilePictureUrl: '', // Gets added in authSvc
      AvailableEquipment: this.availableEquipment,
      ProfileImageUrls: [],
      ProfileRating: 5,
      ProfileRatingCount: 1,
      ProfileReportCount: 0,
    };
    this.authService
      .signupVenue(
        this.signupVenueForm.controls.email.value,
        this.signupVenueForm.controls.password.value,
        venue,
        this.imageUpload.CroppedImage
      )
      .then(() => {
        this.authService.verification();
        this.router.navigate(['profile']);
      })
      .catch(error => {
        console.log(error);
        if (error.code === 'auth/weak-password') {
          this.snackBar.open('Your password is too short', 'close', {
            duration: 2000,
            verticalPosition: 'top'
          });
        }
        if (error.code === 'auth/invalid-email') {
          this.snackBar.open('Please enter a valid email address', 'close', {
            duration: 2000,
            verticalPosition: 'top'
          });
        }
        if (error.code === 'auth/email-already-in-use') {
          this.snackBar.open('This email is already taken', 'close', {
            duration: 2000,
            verticalPosition: 'top'
          });
        }
      });
  }
}
