import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { ForgotPasswordDialogComponent } from './forgotpassword.component';

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

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [Validators.required])
  });

  ngOnInit() {
    this.authService.currentUserObservable.subscribe(user => {
      if (user) {
        this.authService.getUserType().subscribe(type => {
          if (type === 'band') {
            this.router.navigate(['browse']);
          } else {
            this.router.navigate(['profile', 'venue', user.uid]);
          }
        });
      }
    });
  }

  forgotPassword(): void {
    this.dialog.open(ForgotPasswordDialogComponent, {
      width: '450px',
      data: {}
    });
  }

  login(): void {
    this.authService
      .login(
        this.loginForm.controls.email.value,
        this.loginForm.controls.password.value
      )
      .then(res => {
        this.router.navigate(['browse']);
      })
      .catch(error => {
        console.log(error);
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password'
        ) {
          this.snackBar.open(
            'You have entered incorrect credentials',
            'close',
            { duration: 2000 }
          );
        }
      });
  }
}
