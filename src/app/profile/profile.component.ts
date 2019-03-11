import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef } from "@angular/material";
import { ProfileService } from "../services/profile.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  private uid: string;
  private profile_data: any = null;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit() {
    if (this.route.snapshot.params["id"]) {
      this._setData(this.route.snapshot.params["id"]);
    } else {
      this._getCurrentUserProfile();
    }
  }

  private _getCurrentUserProfile() {
    if (!this.authService.currentUserID) {
      this.authService.currentUserObservable.subscribe(user => {
        this._setData(user.uid);
      });
    } else {
      this._setData(this.authService.currentUserID);
    }
  }

  private _setData(uid: string) {
    this.profileService
      .getArtistObserverById(uid)
      .then(doc => (doc.exists ? (this.profile_data = [doc.data()]) : [null]));
  }

  reviewModal(): void {
    const dialogRef = this.dialog.open(ReviewModalDialog, {
      width: "300px",
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
}

@Component({
  selector: "review-dialog",
  templateUrl: "./review-dialog.html"
})
export class ReviewModalDialog {
  constructor(public dialogRef: MatDialogRef<ReviewModalDialog>) {}

  reviewModalForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required])
  });

  send(): void {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(ReviewDialog, {width: '450px', data: {}});
  }
}
