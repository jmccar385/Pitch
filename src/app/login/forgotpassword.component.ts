import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotPasswordDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  send(): void {
    this.authService
      .resetPassword(this.forgotPasswordForm.controls.email.value)
      .then(() => {
        this.dialogRef.close();
        this.snackBar.open(
          'Please check your email to reset your password',
          'close',
          {
            duration: 2000,
            verticalPosition: 'top'
          }
        );
      })
      .catch(error => {
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/invalid-email'
        ) {
          this.snackBar.open('We dont recognize this email', 'close', {
            duration: 2000,
            verticalPosition: 'top'
          });
        }
      });
  }
}
