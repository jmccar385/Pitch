import { Component } from "@angular/core";
import { ProfileService } from "../services/profile.service";

@Component({
  selector: "image-upload",
  templateUrl: "image-upload.component.html",
  styleUrls: ["image-upload.component.css"]
})
export class ImageUploadComponent {
  private uploaded = false;
  private downloadUrl = '';

  constructor(private profileService: ProfileService) {}

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", (event: any) => {
      this.profileService
        .uploadImage(file)
        .subscribe(res => {
          debugger;
          this.uploaded = true;
          imageInput.value = '';
          res.ref.getDownloadURL().then((val) => this.downloadUrl = val);
        }, err => {
          this.uploaded = false;
          console.warn("Could not upload image file. Should handle this better.");
        });
    });

    reader.readAsDataURL(file);
  }

  UploadComplete = () => this.uploaded;
  DownloadURL = () => this.downloadUrl;
}
