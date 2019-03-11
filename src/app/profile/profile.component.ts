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
  private profile_data: any = null;
  profileUrl: string;
  editAbout: boolean = false;
  editAddress: boolean = false;
  slideIndex: number = 1;

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
      this.authService.currentUserObservable.subscribe(user => this._setData(user.uid));
    } else {
      this._setData(this.authService.currentUserID);
    }
  }

  private _setData(uid: string) {
    this.profileService
      .getArtistObserverById(uid)
      .then(doc => (doc.exists ? (this.profile_data = [doc.data()]) : [null]));
  }

  private changeSlideBy(delta) {
    this.showSlides(this.slideIndex += delta);
  }

  private jumpToSlide(target) {
    this.showSlides(this.slideIndex = target + 1);
  }

  private showSlides(index) {
    let slides = document.getElementsByClassName("slide-image");
    let dots = document.getElementsByClassName("slide-dot");

    if (slides.length == 0 || dots.length == 0) return;

    if (index > slides.length) this.slideIndex = 1;
    if (index < 1) this.slideIndex = slides.length;

    for (let i = 0; i < slides.length; i++) {
      slides[i].className = slides[i].className.replace(' slide-active', '');
      dots[i].className = dots[i].className.replace(' dot-active', '');
    }

    slides[this.slideIndex - 1].className += " slide-active";
    dots[this.slideIndex - 1].className += " dot-active";
  }

  reviewModal(): void {
    const dialogRef = this.dialog.open(ReviewDialog, {width: "300px", data: {}});
  }

  editAboutField() {
    this.editAbout = true;
  }

  saveAboutField() {
    this.editAbout = false;
  }

  editAddressField() {
    this.editAddress = true;
  }

  saveAddressField() {
    this.editAddress = false;
  }
}
