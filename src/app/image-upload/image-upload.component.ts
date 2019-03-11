import { Component } from "@angular/core";
import { ProfileService } from "../services/profile.service";

@Component({
  selector: "image-upload",
  templateUrl: "image-upload.component.html",
  styleUrls: ["image-upload.component.css"]
})
export class ImageUploadComponent {
  constructor(private profileService: ProfileService) {}

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", (event: any) => {
      this.profileService
        .uploadImage(file)
        .subscribe(res => {
          imageInput.value = '';
        }, err => {
          console.warn("Could not upload image file. Should handle this better.");
        });
    });

    reader.readAsDataURL(file);
  }
}
