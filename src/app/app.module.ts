import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxCroppieModule } from 'ngx-croppie';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { environment } from 'src/environments/environment';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { VerifiedGuard } from './services/verified.guard';
import { ProfileService } from './services/profile.service';
import { MusicService } from './services/music.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordDialogComponent } from './login/forgotpassword.component';
import { BrowseComponent } from './browse/browse.component';
import { SignupComponent } from './signup/signup.component';
import { SignupBandComponent } from './signupBand/signupBand.component';
import { SignupVenueComponent } from './signupVenue/signupVenue.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { ReviewDialogComponent } from './profile/review.component';
import { ProfileImageDialogComponent } from './profile/profile-image.component';
import { UploadDialogComponent } from './profile/image-upload.component';
import { PitchDialogComponent } from './profile/pitch.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { SettingsComponent } from './settings/settings.component';
import { HttpClientModule } from '@angular/common/http';
import { EventSchedulerComponent } from './event-scheduler/event-scheduler.component';
import { SpotifyAlertDialogComponent } from './signup/spotifyalert.component';
import { NewEmailDialogComponent } from './settings/newemail.component';
import { MessagesComponent } from './messages/messages.component';
import { ConversationComponent } from './conversation/conversation.component';
import { AcceptanceModalComponent } from './acceptance-modal/acceptance-modal.component';
import { HeaderService } from './services/header.service';
import { SaveAlertDialogComponent } from './settings/savealert.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordDialogComponent,
    ReviewDialogComponent,
    UploadDialogComponent,
    PitchDialogComponent,
    ProfileImageDialogComponent,
    SpotifyAlertDialogComponent,
    BrowseComponent,
    SignupComponent,
    ProfileComponent,
    HeaderComponent,
    SignupVenueComponent,
    SignupBandComponent,
    ImageUploadComponent,
    SettingsComponent,
    NewEmailDialogComponent,
    EventSchedulerComponent,
    MessagesComponent,
    ConversationComponent,
    AcceptanceModalComponent,
    SaveAlertDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    HttpClientModule,
    MaterialModule,
    NgxCroppieModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    VerifiedGuard,
    ProfileService,
    MusicService,
    HeaderService
  ],
  entryComponents: [
    ForgotPasswordDialogComponent,
    ReviewDialogComponent,
    SpotifyAlertDialogComponent,
    NewEmailDialogComponent,
    UploadDialogComponent,
    PitchDialogComponent,
    ProfileImageDialogComponent,
    AcceptanceModalComponent,
    SaveAlertDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
