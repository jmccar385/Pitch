import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { PitchDialogData, Event } from '../models';


@Component({
  selector: 'app-pitch-dialog',
  templateUrl: './pitch.component.html',
  styleUrls: ['./pitch.component.css']
})

export class PitchDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PitchDialogComponent>,
    private profileService: ProfileService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: PitchDialogData
  ) {}

  pitchForm: FormGroup = new FormGroup({
    pitch: new FormControl('', [
      Validators.required,
      Validators.max(200),
    ]),
    tracks: new FormControl('', [
      Validators.required,
    ]),
    events: new FormControl('', {})
  });

  private artist: any;

  ngOnInit() {
    this.profileService.getArtistObserverById(this.authService.currentUserID).subscribe(artist => {
      this.artist = artist;
    });
  }

  pitch(): void {
    console.log(this.pitchForm.controls.tracks.value);
    // this.dialogRef.close();
  }
}
