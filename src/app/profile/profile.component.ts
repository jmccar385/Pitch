import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ProfileService } from '../services/profile.service';
import { ReviewDialog } from './review.component';
import { Playlist, Equipment } from '../models';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {
    this.equipment = this.firestore.collection('Equipment').valueChanges();
  }
  private profile: any = null;
  slideIndex = 1;
  userType: string;
  view: boolean;
  playlists: Playlist[] = [];
  equipment: Observable<Array<{}>>;
  availableEquipment: Equipment[] = [];

  profileForm: FormGroup = new FormGroup({
    address: new FormControl({ value: ''}, [
      Validators.required
    ]),
    biography: new FormControl({ value: ''}, [
      Validators.required
    ]),
    playlist: new FormControl({ value: ''}, [
      Validators.required
    ]),
  });

  select(equip) {
    this.availableEquipment.includes(equip)
      ? this.availableEquipment.splice(this.availableEquipment.indexOf(equip))
      : this.availableEquipment.push(equip);
  }

  ngOnInit() {
    this.userType = this.route.snapshot.params.userType;
    this._setData(this.route.snapshot.params.id, this.userType);
    this.view = (this.route.snapshot.params.id === this.authService.currentUserID);
    this.profileForm.disable();
  }

  private _setData(uid: string, userType: string) {
    if (userType === 'band') {
      this.profileService.getArtistObserverById(uid).then(doc => {
        // tslint:disable-next-line:no-unused-expression
        doc.exists ? (this.profile = [doc.data()][0]) : [null]; // change to if statement
        this.profileForm.controls.address.setValue(this.profile.ProfileAddress);
        this.profileForm.controls.biography.setValue(this.profile.ProfileBiography);
        this.profileForm.controls.playlist.setValue(this.profile.Playlist.TrackHref);
        this.playlists.push(this.profile.Playlist);
      });
    } else if (userType === 'venue') {
      this.profileService.getVenueObserverById(uid).subscribe(record => {
        if (record == null || record.length <= 0) {
          return;
        }

        this.profile = record[0];
        record.forEach(node => {
          if (node.SubCollection == null || node.SubCollection.length === 0) {
            return;
          }
          // revise profileService.getVenueObserverById with Claudio

          // if (node.SubCollection[0].EventDateTime) {
          //   this.profile.events = this.profile.events || [];
          //   node.SubCollection.forEach(event =>
          //     this.profile.events.push(event)
          //   );
          // } else {
          //   this.profile.equipment = this.profile.equipment || [];
          //   node.SubCollection.forEach(equipment =>
          //     this.profile.equipment.push(equipment)
          //   );
          // }
          this.profile.equipment = this.profile.equipment || [];
          node.SubCollection.forEach(equipment =>
            this.profile.equipment.push(equipment)
          );
        });

        this.profileForm.controls.address.setValue(this.profile.ProfileAddress);
        this.profileForm.controls.biography.setValue(this.profile.ProfileBiography);
      });
    }
  }

  private changeSlideBy(delta) {
    this.showSlides((this.slideIndex += delta));
  }

  private jumpToSlide(target) {
    this.showSlides((this.slideIndex = target + 1));
  }

  private showSlides(index) {
    const slides = document.getElementsByClassName('slide-image');

    if (slides.length === 0) {
      return;
    }

    if (index > slides.length) {
      this.slideIndex = 1;
    }
    if (index < 1) {
      this.slideIndex = slides.length;
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < slides.length; i++) {
      slides[i].className = slides[i].className.replace(' slide-active', '');
    }

    slides[this.slideIndex - 1].className += ' slide-active';
  }

  reviewModal(): void {
    const dialogRef = this.dialog.open(ReviewDialog, {
      width: '300px',
      data: {}
    });
  }

  editProfile() {
    // add logic for spotify refresh token
    this.profileForm.enable();
  }

  saveProfile() {
    this.profileForm.disable();
  }

  viewProfile() {
    this.view = !this.view;
  }
}
