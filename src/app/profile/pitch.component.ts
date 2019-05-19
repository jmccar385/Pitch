import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { PitchDialogData, Event, Pitch } from '../models';
import { MessagesService } from '../services/messages.service';
import { tap } from 'rxjs/operators';


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
    private messageService: MessagesService,
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

  pitch() {
    const pitch: Pitch = {
      message: this.pitchForm.controls.pitch.value,
      tracks: this.pitchForm.controls.tracks.value,
      events: this.pitchForm.controls.events.value
    };

    console.log(pitch.tracks[0]);
    this.messageService.sendPitch(this.data.venueId, pitch).pipe(
      tap(() => {
        this.dialogRef.close();
      })
    ).subscribe();
  }
}
