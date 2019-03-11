import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material";
import { ProfileService } from "../services/profile.service";
import { ReviewDialog } from "./review.component"

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  private uid: string;
  private profile: any = null;
  profileUrl: string;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
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
      .then((doc) => {
        (doc.exists ? (this.profile = [doc.data()][0]) : [null])
        this.profileForm.controls.address.setValue(this.profile.ProfileAddress);
        this.profileForm.controls.biography.setValue(this.profile.ProfileBiography);
      });   
  }

  reviewModal(): void {
    const dialogRef = this.dialog.open(ReviewDialog, {width: "300px", data: {}});
  }

  editBiography() {
    this.profileForm.controls.biography.enable();
  }

  saveBiography() {
    this.profileForm.controls.biography.disable();
  }

  editAddress() {
    this.profileForm.controls.address.enable();
  }

  saveAddress() {
    this.profileForm.controls.address.disable();
  }

  profileForm: FormGroup = new FormGroup({
    address: new FormControl({value: '', disabled: true}, [
      Validators.required,
    ]),

    biography: new FormControl({value: '', disabled: true}, [
      Validators.required,
    ])
  });
}
