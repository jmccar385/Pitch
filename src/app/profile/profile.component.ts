import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ProfileService } from '../services/profile.service';
import { ReviewDialog } from './review.component';

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
    private authService: AuthService
  ) {}
  private profile: any = null;
  slideIndex = 1;
  userType: string;
  view: boolean;

  profileForm: FormGroup = new FormGroup({
    address: new FormControl({ value: '', disabled: true }, [
      Validators.required
    ]),

    biography: new FormControl({ value: '', disabled: true }, [
      Validators.required
    ]),
    bass_cabinet: new FormControl({ value: '', disabled: true }, []),
    bass_amp: new FormControl({ value: '', disabled: true }, []),
    guitar_cabinet: new FormControl({ value: '', disabled: true }, []),
    guitar_amp: new FormControl({ value: '', disabled: true }, []),
    drum_throne: new FormControl({ value: '', disabled: true }, []),
    drum_hardware: new FormControl({ value: '', disabled: true }, []),
    drum_shells: new FormControl({ value: '', disabled: true }, []),
    stage_monitor: new FormControl({ value: '', disabled: true }, []),
    microphones: new FormControl({ value: '', disabled: true }, [])
  });

  ngOnInit() {
    this.userType = this.route.snapshot.params.userType;
    this._setData(this.route.snapshot.params.id, this.userType);
    this.view =
      this.route.snapshot.params.id === this.authService.currentUserID;
  }

  private _setData(uid: string, userType: string) {
    if (userType === 'band') {
      this.profileService.getArtistObserverById(uid).then(doc => {
        // tslint:disable-next-line:no-unused-expression
        doc.exists ? (this.profile = [doc.data()][0]) : [null]; // change to if statement
        this.profileForm.controls.address.setValue(this.profile.ProfileAddress);
        this.profileForm.controls.biography.setValue(
          this.profile.ProfileBiography
        );
      });
    } else if (userType === 'venue') {
      this.profileService.getVenueObserverById(uid).subscribe(record => {
        if (record == null || record.length <= 0) { return; }

        this.profile = record[0];
        record.forEach(node => {
          if (node.SubCollection == null || node.SubCollection.length === 0) {
            return;
          }

          if (node.SubCollection[0].EventDateTime) {
            this.profile.events = this.profile.events || [];
            node.SubCollection.forEach(event =>
              this.profile.events.push(event)
            );
          } else {
            this.profile.equipment = this.profile.equipment || [];
            node.SubCollection.forEach(equipment =>
              this.profile.equipment.push(equipment)
            );
          }
        });

        this.profileForm.controls.address.setValue(this.profile.ProfileAddress);
        this.profileForm.controls.biography.setValue(
          this.profile.ProfileBiography
        );
        for (const equipment of this.profile.AvailableEquipment) {
          switch (equipment.Name) {
            case 'Guitar Cabinet':
              this.profileForm.controls.guitar_cabinet.setValue(true);
              break;
            case 'Guitar Amplifier':
              this.profileForm.controls.guitar_amp.setValue(true);
              break;
            case 'Bass Cabinet':
              this.profileForm.controls.bass_cabinet.setValue(true);
              break;
            case 'Bass Amplifier':
              this.profileForm.controls.bass_amp.setValue(true);
              break;
            case 'Stage Monitor':
              this.profileForm.controls.stage_monitor.setValue(true);
              break;
            case 'Microphones/Stands':
              this.profileForm.controls.microphones.setValue(true);
              break;
            case 'Drum Throne':
              this.profileForm.controls.drum_throne.setValue(true);
              break;
            case 'Drum Hardware':
              this.profileForm.controls.drum_hardware.setValue(true);
              break;
            case 'Drum Shells':
              this.profileForm.controls.drum_shells.setValue(true);
              break;
          }
        }
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
    const dots = document.getElementsByClassName('slide-dot');

    if (slides.length === 0 || dots.length === 0) { return; }

    if (index > slides.length) { this.slideIndex = 1; }
    if (index < 1) { this.slideIndex = slides.length; }

    for (let i = 0; i < slides.length; i++) {
      slides[i].className = slides[i].className.replace(' slide-active', '');
      dots[i].className = dots[i].className.replace(' dot-active', '');
    }

    slides[this.slideIndex - 1].className += ' slide-active';
    dots[this.slideIndex - 1].className += ' dot-active';
  }

  reviewModal(): void {
    const dialogRef = this.dialog.open(ReviewDialog, {
      width: '300px',
      data: {}
    });
  }

  editBiography() {
    this.profileForm.controls.biography.enable();
    console.log(this.profile);
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

  editEquipment() {
    this.profileForm.controls.bass_cabinet.enable();
    this.profileForm.controls.bass_amp.enable();
    this.profileForm.controls.guitar_cabinet.enable();
    this.profileForm.controls.guitar_amp.enable();
    this.profileForm.controls.drum_throne.enable();
    this.profileForm.controls.drum_hardware.enable();
    this.profileForm.controls.drum_shells.enable();
    this.profileForm.controls.stage_monitor.enable();
    this.profileForm.controls.microphones.enable();
  }

  saveEquipment() {
    this.profileForm.controls.bass_cabinet.disable();
    this.profileForm.controls.bass_amp.disable();
    this.profileForm.controls.guitar_cabinet.disable();
    this.profileForm.controls.guitar_amp.disable();
    this.profileForm.controls.drum_throne.disable();
    this.profileForm.controls.drum_hardware.disable();
    this.profileForm.controls.drum_shells.disable();
    this.profileForm.controls.stage_monitor.disable();
    this.profileForm.controls.microphones.disable();
  }
}
