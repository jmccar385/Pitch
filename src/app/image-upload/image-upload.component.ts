import {
  Component,
  OnInit,
  ViewChild,
  OnChanges,
  forwardRef
} from '@angular/core';
import { CroppieOptions, ResultOptions } from 'croppie';
import { NgxCroppieComponent } from 'ngx-croppie';
// import { ProfileService } from "../services/profile.service";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'image-upload',
  templateUrl: 'image-upload.component.html',
  styleUrls: ['image-upload.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true
    }
  ]
})
export class ImageUploadComponent
  implements OnInit, OnChanges, ControlValueAccessor {

  public get CroppedImage(): any {
    return this.croppedImage;
  }

  constructor() {}
  // tslint:disable-next-line:variable-name
  private _sourceImage: any;
  croppedImage: any;
  public formatOptions: ResultOptions = { type: 'blob', size: 'original' };
  public cropOptions: CroppieOptions = {
    viewport: { width: 250, height: 250 },
    boundary: { width: 300, height: 300 },
    enforceBoundary: true
  };

  @ViewChild('ngxCroppie')
  ngxCroppie: NgxCroppieComponent;

  static ImageValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== null) {
        return control.value.contains('data:image/') ? { invalidFormat: true } : null;
      }

      return null;
    };
  }

  ngOnInit() {}
  ngOnChanges(changes: any) {
    if (this.croppedImage || !changes || !changes.imageUrl) { return; }

    if (changes.imageUrl.previousValue || !changes.imageUrl.currentValue) {
      return;
    }

    this.croppedImage = changes.imageUrl.currentValue;
    this._onChange(this.croppedImage);
  }

  imageLoad(e: any) {
    if (!e.target || !e.target.files || e.target.files.length !== 1) { return; }

    const source: File = e.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onloadend = (_: Event) => {
      this._sourceImage = reader.result.toString();
      this.croppedImage = reader.result.toString();
    };
    reader.readAsDataURL(source);
  }

  newCroppedImage(newImage: string) {
    this.croppedImage = newImage;
    this._onChange(this.croppedImage);
  }

  writeValue(value: any) {
    if (value === undefined) { return; }

    this.croppedImage = value;
    this._onChange(this.croppedImage);
  }

  // tslint:disable-next-line:variable-name
  _onChange: any = (_: any) => {};
  registerOnChange(fn: any) {
    this._onChange = fn;
  }

  registerOnTouched() {}
}
