import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ProfileService } from '../services/profile.service';
import { MusicService } from '../services/music.service';
import { ReviewDialogComponent } from './review.component';
import { UploadDialogComponent } from './image-upload.component';
import { PitchDialogComponent } from './pitch.component';
import { ProfileImageDialogComponent } from './profile-image.component';
import { Playlist, Equipment } from '../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private profileService: ProfileService,
    private musicService: MusicService,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  private profile: any = null;
  slideIndex = 1;
  userType: string;
  view: boolean;
  seeView = false;
  playlists: Playlist[] = [];
  equipment: Observable<Equipment[]>;
  equipmentList: Equipment[] = [];
  availableEquipment: Equipment[] = [];
  profileImageUrls: string[];

  profileForm: FormGroup = new FormGroup({
    address: new FormControl({ value: '' }, [Validators.required]),
    biography: new FormControl({ value: '' }, [Validators.required]),
    playlist: new FormControl({ value: '' }, [Validators.required])
  });

  select(equip) {
    this.availableEquipment.includes(equip)
      ? this.availableEquipment.splice(this.availableEquipment.indexOf(equip))
      : this.availableEquipment.push(equip);
  }

  ngOnInit() {
    this.userType = this.route.snapshot.params.userType;
    this.view =
      this.route.snapshot.params.id === this.authService.currentUserID;
    if (this.userType === 'venue') {
      this.equipment = this.profileService.getEquipmentList();
      this.equipment.subscribe(items => {
        for (const item of items) {
          this.equipmentList.push(item);
          this.profileForm.addControl(
            item.Name.toLowerCase()
              .replace(' ', '_')
              .replace(' ', '/'),
            new FormControl()
          );
        }
        this._setData(this.route.snapshot.params.id, this.userType);
        this.profileForm.disable();
      });
    } else {
      this._setData(this.route.snapshot.params.id, this.userType);
      this.profileForm.disable();
    }
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
        this.profileForm.controls.playlist.setValue(
          this.profile.Playlist.TrackHref
        );
        this.playlists.push(this.profile.Playlist);
        this.profileImageUrls = [...this.profile.ProfileImageUrls];
        this.profileImageUrls.unshift(this.profile.ProfilePictureUrl);
      });
    } else if (userType === 'venue') {
      this.profileService.getVenueObserverById(uid).subscribe(venue => {
        if (venue == null) {
          return;
        }

        this.profile = venue;
        console.log(this.profile);
        // venue.forEach(node => {
        //   if (node.SubCollection == null || node.SubCollection.length === 0) {
        //     return;
        //   }
        //   // revise profileService.getVenueObserverById with Claudio
        //   // need to add event items at some point

        //   // if (node.SubCollection[0].EventDateTime) {
        //   //   this.profile.events = this.profile.events || [];
        //   //   node.SubCollection.forEach(event =>
        //   //     this.profile.events.push(event)
        //   //   );
        //   // } else {
        //   //   this.profile.equipment = this.profile.equipment || [];
        //   //   node.SubCollection.forEach(equipment =>
        //   //     this.profile.equipment.push(equipment)
        //   //   );
        //   // }
        //   this.profile.events = this.profile.Events || [];
        //   node.SubCollection.forEach(event => this.profile.events.push(event));

        //   this.profile.equipment = this.profile.equipment || [];
        //   node.SubCollection.forEach(equipment =>
        //     this.profile.equipment.push(equipment)
        //   );
        // });

        this.profileForm.controls.address.setValue(this.profile.ProfileAddress);
        this.profileForm.controls.biography.setValue(
          this.profile.ProfileBiography
        );
        this.availableEquipment = this.profile.AvailableEquipment;
        this.profileImageUrls = [...this.profile.ProfileImageUrls];
        this.profileImageUrls.unshift(this.profile.ProfilePictureUrl);
        for (const review of this.profile.SubCollection) {
          review.CreationDate = new Date(review.CreationDate);
        }
        for (const equipment of this.profile.AvailableEquipment) {
          this.profileForm.controls[
            equipment.Name.toLowerCase()
              .replace(' ', '_')
              .replace(' ', '/')
          ].setValue(true);
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
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '300px',
      data: {
        userId: this.route.snapshot.params.id,
        userType: this.route.snapshot.params.userType,
        rating: this.profile.ProfileRating,
        ratingCount: this.profile.ProfileRatingCount
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.profile.ProfileRating = result.rating;
      this.profile.ProfileRatingCount = result.ratingCount;
    });
  }

  editProfile() {
    // add logic for spotify refresh token
    this.profileForm.enable();
  }

  saveProfile() {
    this.profileForm.disable();
    if (this.userType === 'venue') {
      this.profileService.updateVenueById(
        this.route.snapshot.params.id,
        this.availableEquipment,
        this.profileForm.controls.address.value,
        this.profileForm.controls.biography.value
      );
    } else {
      if (
        this.profile.Playlist.TrackHref !==
        this.profileForm.controls.playlist.value
      ) {
        const PlaylistName = this.playlists.find(
          x => x.TrackHref === this.profileForm.controls.playlist.value
        ).Name;
        this.profile.Playlist = {
          Name: PlaylistName,
          TrackHref: this.profileForm.controls.playlist.value,
          TrackCount: 0
        };
        this.musicService
          .getPlaylistTracks(this.profile.Playlist.TrackHref)
          .subscribe(response => {
            this.profile.Tracks = [];
            for (let i = 0; i < response.items.length; i++) {
              if (i > 9) {
                break;
              }
              if (response.items[i].track.is_playable) {
                this.profile.Tracks.push({
                  Name: response.items[i].track.name,
                  Preview: response.items[i].track.preview_url
                });
              }
            }
            this.profile.Playlist.TrackCount = this.profile.Tracks.length;
          });
        this.profileService.updateArtistById(
          this.route.snapshot.params.id,
          this.profileForm.controls.address.value,
          this.profileForm.controls.biography.value,
          this.profile.Playlist,
          this.profile.Tracks
        );
      }
      this.profileService.updateArtistById(
        this.route.snapshot.params.id,
        this.profileForm.controls.address.value,
        this.profileForm.controls.biography.value
      );
    }
  }

  viewProfile() {
    this.seeView = !this.seeView;
    this.view = !this.view;
  }

  addPicture() {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '90%',
      maxWidth: '100vw',
      height: '90%',
      data: {
        userId: this.route.snapshot.params.id,
        userType: this.route.snapshot.params.userType,
        profileImageUrls: this.profile.ProfileImageUrls
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      this.profileImageUrls.push(result);
    });
  }

  deletePicture(path: string) {
    if (this.profile.ProfilePictureUrl === path) {
      this.snackBar.open(
        'You cannot delete your profile Picture without selecting a new one first',
        'close',
        { duration: 5000 }
      );
    } else {
      this.profileImageUrls.splice(this.profileImageUrls.indexOf(path), 1);
      this.jumpToSlide(0);
      this.profile.ProfileImageUrls.splice(this.profile.ProfileImageUrls.indexOf(path), 1);
      this.profileService.deteleImage(
        this.authService.currentUserID,
        this.userType,
        path,
        this.profile.ProfileImageUrls
      );
    }
  }

  makeProfilePicture(imagePath: string) {
    if (this.profile.ProfilePictureUrl === imagePath) {
      this.snackBar.open(
        'This is already your profile picture',
        'close',
        { duration: 5000 }
      );
    } else {
      const dialogRef = this.dialog.open(ProfileImageDialogComponent, {
        width: '450px',
        data: {
          userId: this.route.snapshot.params.id,
          userType: this.route.snapshot.params.userType,
          profilePictureUrl: this.profile.ProfilePictureUrl,
          newProfilePictureUrl: imagePath,
          profileImageUrls: this.profile.ProfileImageUrls
        },
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.profile.ProfileImageUrls.push(this.profile.ProfilePictureUrl);
          this.profileImageUrls.push(this.profile.ProfilePictureUrl);
        }
        this.profile.ProfileImageUrls.splice(this.profile.ProfileImageUrls.indexOf(imagePath), 1);
        this.profileImageUrls.splice(this.profileImageUrls.indexOf(imagePath), 1);
        this.profileImageUrls.shift();
        this.profileImageUrls.unshift(imagePath);
        setTimeout(() => this.jumpToSlide(0));
        this.profileService.updateProfilePicture(
          this.authService.currentUserID,
          this.userType,
          imagePath,
          this.profile.ProfileImageUrls
        );
      });
    }
  }

  pitch() {
    const dialogRef = this.dialog.open(PitchDialogComponent, {
      width: '90%',
      maxWidth: '100vw',
      height: '90%',
      autoFocus: false,
      data: {
        events: this.profile.events
      }
    });
  }
}
