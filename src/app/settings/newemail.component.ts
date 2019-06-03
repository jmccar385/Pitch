import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-email-dialog',
  templateUrl: './newemail.component.html',
  styleUrls: ['./newemail.component.css']
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
        const newEmail = this.newEmailForm.controls.email.value;

        this.authService
          .changePassword(newEmail)
          .then(() => {
            this.dialogRef.close();
            this.authService.verification();
            this.snackBar.open('A verification email has been sent', 'close', {
              duration: 2000,
              verticalPosition: 'top'
            });
          })
          .catch(() => {
            this.snackBar.open(
              'Could not update email. Please try again later.',
              'close',
              {
                duration: 2000,
                verticalPosition: 'top'
              }
            );
          });
      })
      .catch(error => {
        this.snackBar.open(
          'You have entered incorrect credentials',
          'close',
          {
            duration: 2000,
            verticalPosition: 'top'
          }
        );
      });
  }
}
