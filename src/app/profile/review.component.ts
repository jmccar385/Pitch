import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { Review, ReviewDialogData } from '../models';

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

  review(): void {
    const review: Review = {
      ReviewText: this.reviewForm.controls.review.value,
      ReviewRating: this.reviewForm.controls.rating.value,
      ReviewCreator: this.authService.currentUserID,
      ReviewCreatorName: '',
      CreationDate: Date.now()
    };
    this.data.rating = this.data.rating * this.data.ratingCount;
    this.data.ratingCount++;
    this.data.rating = (this.data.rating + review.ReviewRating) / (this.data.ratingCount);
    this.profileService.createReview(
      review,
      this.data.userId,
      this.data.userType,
      this.data.ratingCount,
      this.data.rating
    );
    this.dialogRef.close({rating: this.data.rating, ratingCount: this.data.ratingCount});
  }
}
