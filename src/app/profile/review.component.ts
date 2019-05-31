import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { Review, ReviewDialogData, Venue, Band } from '../models';
import { map, mergeMap, tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})

export class ReviewDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    private profileService: ProfileService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData
  ) {}

  reviewForm: FormGroup = new FormGroup({
    rating: new FormControl('', [
      Validators.required,
      Validators.max(5),
      Validators.min(0),
    ]),
    review: new FormControl('', [
      Validators.required,
    ]),
  });

  async review() {
    const creatorName$ = this.authService.getUserType().pipe(
      mergeMap(type => {
        return type === 'band' ?
        this.profileService.getArtistObserverById(this.authService.currentUserID) :
        this.profileService.getVenueObserverById(this.authService.currentUserID);
      }),
      map((profile: Band | Venue) => profile.ProfileName),
      take(1)
    );
    const review: Review = {
      ReviewText: this.reviewForm.controls.review.value,
      ReviewRating: this.reviewForm.controls.rating.value,
      ReviewCreator: await creatorName$.toPromise(),
      CreationDate: Date.now()
    };
    this.profileService.createReview(
      review,
      this.data.userId,
      this.data.userType,
    );
    this.dialogRef.close({rating: this.data.rating, ratingCount: this.data.ratingCount});
  }
}
