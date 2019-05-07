import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class NewEmailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NewEmailDialogComponent>,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  newEmailForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    confirmEmail: new FormControl('', [Validators.required])
  });

  send(): void {
    this.authService
      .login(
        this.authService.currentUser.email,
        this.newEmailForm.controls.password.value
      )
      .then(() => {
        const oldEmail = this.authService.currentUser.email;
        const newEmail = this.newEmailForm.controls.email.value;

        this.authService
          .changePassword(newEmail)
          .then(() => {
            this.dialogRef.close();
            this.snackBar.open('Your email has been updated', 'close', {
              duration: 2000
            });
          })
          .catch(() => {
            this.snackBar.open(
              'Could not update email. Please try again later.',
              'close',
              {
                duration: 2000
              }
            );
          });
      })
      .catch(error => {
        this.snackBar.open(
          'You have entered incorrect credentials. Cannot update email.',
          'close',
          { duration: 2000 }
        );
      });
  }
}
