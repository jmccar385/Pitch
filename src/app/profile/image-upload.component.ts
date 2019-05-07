import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileService } from '../services/profile.service';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadDialogData } from '../models';

@Component({
  selector: 'app-image-upload-dialog',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})

export class UploadDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    private profileService: ProfileService,
    @Inject(MAT_DIALOG_DATA) public data: UploadDialogData
  ) {}

  imageUploadForm: FormGroup = new FormGroup({
    image: new FormControl('', [
      Validators.required,
      ImageUploadComponent.ImageValidator
    ]),
  });

  @ViewChild(ImageUploadComponent)
  imageUpload: ImageUploadComponent;

  upload(): void {
    this.profileService.updateProfileImageUrls(this.data.userId, this.data.userType, this.imageUpload.CroppedImage);
    this.dialogRef.close();
  }
}
