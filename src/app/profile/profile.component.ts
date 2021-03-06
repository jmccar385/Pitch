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
import { Playlist, Equipment, Venue, Band, Review, Event } from '../models';
import { Observable } from 'rxjs';
import { HeaderService } from '../services/header.service';
import { mergeMap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private profileService: ProfileService,
    private musicService: MusicService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private headerSvc: HeaderService
  ) {}

  profile: Band | Venue;
  slideIndex = 1;
  userType: string;
  view: boolean;
  playlists: Playlist[] = [];
  equipment: Observable<Equipment[]>;
  equipmentList: Equipment[] = [];
  availableEquipment: Equipment[] = [];
  profileImageUrls: string[];
  loading = false;
  profileReviews;

  profileForm: FormGroup = new FormGroup({
    address: new FormControl({ value: '' }, [Validators.required]),
    biography: new FormControl({ value: '' }, [Validators.required]),
    playlist: new FormControl({ value: '' }, [Validators.required])
  });

  select(equip) {
    let index = -1;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.availableEquipment.length; i++) {
      if (this.availableEquipment[i].Name === equip.Name) {
        index = i;
      }
    }
    index > -1
      ? this.availableEquipment.splice(index, 1)
      : this.availableEquipment.push(equip);
  }

  ngOnInit() {
    this.view =
      this.route.snapshot.params.id === this.authService.currentUserID;
    this.userType = this.route.snapshot.params.userType;
    let profile$: Observable<Band | Venue>;
    if (this.userType === 'band') {
      profile$ = this.profileService.getArtistObserverById(
        this.route.snapshot.params.id
      ) as Observable<Band>;
    } else {
      profile$ = this.profileService.getVenueObserverById(
        this.route.snapshot.params.id
      ) as Observable<Venue>;
    }

    profile$.subscribe((profile: Band | Venue) => {
      this.profile = profile;
    });

    profile$
      .pipe(
        switchMap((profile: Band | Venue) => {
          return this.authService.getUserType();
        })
      )
      .subscribe(type => {
        const startRouterlink = type === 'band' ? ['/browse'] : ['/messages'];
        let endRouterlink = null;
        let iconEnd = null;
        if (this.view) {
          endRouterlink =
            this.userType === 'band'
              ? ['/profile', 'band', 'settings']
              : ['/profile', 'venue', 'settings'];
          iconEnd = 'settings';
        }
        const iconStart = type === 'band' ? 'list' : 'forum';

        // Set header
        this.headerSvc.setHeader({
          title: this.profile.ProfileName,
          iconEnd,
          iconStart,
          endRouterlink,
          startRouterlink
        });

        this._setData(this.route.snapshot.params.id, this.userType);
      });
  }

  private _setData(uid: string, userType: string) {
    if (userType === 'band') {
      this.profile = this.profile as Band;
      this.profileForm.controls.address.setValue(this.profile.ProfileAddress);
      this.profileForm.controls.biography.setValue(
        this.profile.ProfileBiography
      );
      this.profileForm.controls.playlist.setValue(
        this.profile.Playlist.TrackHref
      );
      this.playlists.push(this.profile.Playlist);
      this.profileImageUrls = this.profile.ProfileImageUrls
        ? [...this.profile.ProfileImageUrls]
        : [this.profile.ProfilePictureUrl];
      this.profileImageUrls.unshift(this.profile.ProfilePictureUrl);
      this.profile.Reviews = this.profileService.getReviewsByIdAndType(
        uid,
        userType
      );
    } else if (userType === 'venue') {
      this.profile = this.profile as Venue;
      this.profileForm.controls.address.setValue(this.profile.ProfileAddress);
      this.profileForm.controls.biography.setValue(
        this.profile.ProfileBiography
      );
      this.availableEquipment = this.profile.AvailableEquipment;
      this.profileImageUrls = [...this.profile.ProfileImageUrls];
      this.profileImageUrls.unshift(this.profile.ProfilePictureUrl);

      this.equipment = this.profileService.getEquipmentList();
      this.equipment.subscribe(items => {
        this.profile = this.profile as Venue;
        if (this.equipmentList.length === 0) {
          for (const item of items) {
            this.equipmentList.push(item);
            this.profileForm.addControl(
              item.Name.toLowerCase()
                .replace(' ', '_')
                .replace(' ', '/'),
              new FormControl()
            );
          }
        }
        for (const equipment of this.profile.AvailableEquipment) {
          const equipName = equipment.Name.toLowerCase()
            .replace(' ', '_')
            .replace(' ', '/');
          if (this.profileForm.controls[equipName]) {
            this.profileForm.controls[equipName].setValue(true);
          }
        }
        this.profileForm.disable();
      });
      this.profile.Reviews = this.profileService.getReviewsByIdAndType(
        uid,
        userType
      ) as Observable<Review[]>;

      this.profile.Events = this.profileService.getVenueEventsById(
        uid
      ) as Observable<Event[]>;
    }
    this.profileForm.disable();
  }

  dateToString(millis) {
    return new Date(millis).toDateString();
  }

  changeSlideBy(delta) {
    this.showSlides((this.slideIndex += delta));
  }

  jumpToSlide(target) {
    this.showSlides((this.slideIndex = target + 1));
  }

  showSlides(index) {
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
        userType: this.userType,
        rating: this.profile.ProfileRating,
        ratingCount: this.profile.ProfileRatingCount
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.profile.ProfileRating = result.rating;
      this.profile.ProfileRatingCount = result.ratingCount;
    });
  }

  async editProfile() {
    this.loading = true;
    if (this.userType === 'band') {
      await this.musicService.renewAccessToken();
      const playlists = await this.musicService.getUserPlaylists();
      for (const item of playlists.items) {
        this.playlists.push({
          Name: item.name,
          TrackHref: item.tracks.href,
          TrackCount: item.tracks.total
        });
      }
    }
    this.profileForm.enable();
    this.loading = false;
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
      this.profile = this.profile as Band;
      if (
        this.profile.Playlist.TrackHref !==
          this.profileForm.controls.playlist.value &&
        this.userType === 'band'
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
            this.profile = this.profile as Band;
            this.profile.Tracks = [];
            for (let i = 0; i < response.items.length; i++) {
              if (i > 9) {
                break;
              }
              if (true) {
                this.profile.Tracks.push({
                  Name: response.items[i].track.name,
                  Preview: response.items[i].track.preview_url
                });
              }
            }
            this.profile.Playlist.TrackCount = this.profile.Tracks.length;
          });
      }
      this.profileService.updateArtistById(
        this.route.snapshot.params.id,
        this.profileForm.controls.address.value,
        this.profileForm.controls.biography.value,
        this.profile.Playlist,
        this.profile.Tracks,
        this.profile.SearchRadius
      );
    }
  }

  addPicture() {
    this.dialog.open(UploadDialogComponent, {
      width: '90%',
      maxWidth: '100vw',
      height: '90%',
      data: {
        userId: this.route.snapshot.params.id,
        userType: this.userType,
        profileImageUrls: this.profile.ProfileImageUrls
      },
      autoFocus: false
    });
  }

  deletePicture(path: string) {
    if (this.profile.ProfilePictureUrl === path) {
      this.snackBar.open('Select a new profile picture first', 'close', {
        duration: 5000
      });
    } else {
      this.profileImageUrls.splice(this.profileImageUrls.indexOf(path), 1);
      this.jumpToSlide(0);
      this.profile.ProfileImageUrls.splice(
        this.profile.ProfileImageUrls.indexOf(path),
        1
      );
      this.profileService.deleteImage(
        this.authService.currentUserID,
        this.userType,
        path,
        this.profile.ProfileImageUrls
      );
    }
  }

  makeProfilePicture(imagePath: string) {
    if (this.profile.ProfilePictureUrl === imagePath) {
      this.snackBar.open('This is already your profile picture', 'close', {
        duration: 5000
      });
    } else {
      const dialogRef = this.dialog.open(ProfileImageDialogComponent, {
        width: '450px',
        data: {
          userId: this.route.snapshot.params.id,
          userType: this.userType,
          profilePictureUrl: this.profile.ProfilePictureUrl,
          newProfilePictureUrl: imagePath,
          profileImageUrls: this.profile.ProfileImageUrls
        },
        autoFocus: false
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.profile.ProfileImageUrls.push(this.profile.ProfilePictureUrl);
          this.profileImageUrls.push(this.profile.ProfilePictureUrl);
        }
        this.profile.ProfileImageUrls.splice(
          this.profile.ProfileImageUrls.indexOf(imagePath),
          1
        );
        this.profileImageUrls.splice(
          this.profileImageUrls.indexOf(imagePath),
          1
        );
        const oldProfileImage = this.profileImageUrls.shift();
        this.profileImageUrls.unshift(imagePath);
        setTimeout(() => this.jumpToSlide(0));
        this.profileService.updateProfilePicture(
          this.authService.currentUserID,
          this.userType,
          imagePath,
          this.profile.ProfileImageUrls,
          result,
          oldProfileImage
        );
      });
    }
  }

  pitch() {
    this.profileService
      .getVenueEventsById(this.route.snapshot.params.id)
      .subscribe(events => {
        this.dialog.open(PitchDialogComponent, {
          width: '90%',
          maxWidth: '100vw',
          height: '90%',
          autoFocus: false,
          data: {
            events,
            venueId: this.route.snapshot.params.id
          }
        });
      });
  }
}
