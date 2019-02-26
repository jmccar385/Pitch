import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  forgotPassword(): void {
    const dialogRef = this.dialog.open(ForgotPasswordDialog, {
      width: '300px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  login(): void {

    if (this.loginForm.controls.userType.value === '') {
      this.snackBar.open('Please select either Band or Venue above.', 'Close', {
        duration: 3000
      });
    }


    if (this.loginForm.valid) {
      this.snackBar.dismiss();
      this.authService
        .login(
          this.loginForm.controls.email.value,
          this.loginForm.controls.password.value
        )
        .then(res => {
          this.router.navigate(['browse']);
        });
    }
  }

  status(): void {
    console.log(this.authService.authenticated);
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [Validators.required]),

    userType: new FormControl('', [Validators.required])
  });
}

@Component({
  selector: 'forgot-password-dialog',
  templateUrl: 'forgot-password-dialog.html'
})
export class ForgotPasswordDialog {
  constructor(public dialogRef: MatDialogRef<ForgotPasswordDialog>) {}

  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  send(): void {
    this.dialogRef.close();
  }
}
