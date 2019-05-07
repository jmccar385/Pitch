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
import { UploadDialogComponent } from './profile/image-upload.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import {
  SettingsComponent,
  AccountSettingsComponent,
  NotificationSettingsComponent
} from './settings/settings.component';
import { HttpClientModule } from '@angular/common/http';
import { EventSchedulerComponent } from './event-scheduler/event-scheduler.component';
import { SpotifyAlertDialog } from './signup/spotifyalert.component';
import { NewEmailDialogComponent } from './settings/newemail.component';
import { MusicService } from './services/music.service';
import { MessagesComponent } from './messages/messages.component';
import { ConversationComponent } from './conversation/conversation.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordDialogComponent,
    ReviewDialogComponent,
    UploadDialogComponent,
    SpotifyAlertDialog,
    BrowseComponent,
    SignupComponent,
    ProfileComponent,
    HeaderComponent,
    SignupVenueComponent,
    SignupBandComponent,
    ImageUploadComponent,
    SettingsComponent,
    AccountSettingsComponent,
    NotificationSettingsComponent,
    NewEmailDialogComponent,
    EventSchedulerComponent,
    MessagesComponent,
    ConversationComponent,
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
    ProfileService
  ],
  entryComponents: [
    ForgotPasswordDialogComponent,
    ReviewDialogComponent,
    SpotifyAlertDialog,
    NewEmailDialogComponent,
    UploadDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
