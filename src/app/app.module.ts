import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxCroppieModule } from 'ngx-croppie';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { VerifiedGuard } from './services/verified.guard';
import { ProfileService } from './services/profile.service';
import { MusicService } from './services/music.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordDialog } from './login/forgotpassword.component';
import { BrowseComponent } from './browse/browse.component';
import { SignupComponent } from './signup/signup.component';
import { HeaderComponent } from './header/header.component';
import { SignupBandComponent } from './signupBand/signupBand.component';
import { SignupVenueComponent } from './signupVenue/signupVenue.component';
import { ProfileComponent } from './profile/profile.component';
import { ReviewDialog } from './profile/review.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordDialog,
    ReviewDialog,
    BrowseComponent,
    SignupComponent,
    ProfileComponent,
    HeaderComponent,
    SignupVenueComponent,
    SignupBandComponent,
    ImageUploadComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    MaterialModule,
    NgxCroppieModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AuthService, AuthGuard, VerifiedGuard, ProfileService],
  entryComponents: [ForgotPasswordDialog, ReviewDialog],
  bootstrap: [AppComponent]
})
export class AppModule {}
