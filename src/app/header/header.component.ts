import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private snackBar: MatSnackBar,) { }

  id: string;
  userProfileUrl: string;
  viewProfileUrl: RegExp;
  Name: string = "Venue";


  ngOnInit() {
  	 this.id = this.authService.currentUserID;
  	 this.userProfileUrl = "/profile/" + this.authService.currentUserID;
     this.viewProfileUrl = new RegExp("/profile/[A-Z a-z 0-9]*");
     console.log("/profile/lkjalkkjasf".match(this.viewProfileUrl) != null);
  }

  verified(): void {
  	if (!this.authService.currentUser.emailVerified) {
  		this.snackBar.open("Please verify your email first. See settings.", "close", {duration: 2000});
  	} else {
  		this.router.navigate(["/browse"]);
  	}
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

}
