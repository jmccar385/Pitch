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
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { VerifiedGuard } from './services/verified.guard';
import { ProfileService } from './services/profile.service';
import { MessagesService } from './services/messages.service';

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
import { HttpClientModule } from '@angular/common/http';
import { MessagesComponent } from './messages/messages.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ServiceWorkerModule } from '@angular/service-worker';

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
    MessagesComponent,
    ConversationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    AngularFireMessagingModule,
    HttpClientModule,
    MaterialModule,
    NgxCroppieModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('/firebase-messaging-sw.js', { enabled: environment.production }),
  ],
  providers: [AuthService, AuthGuard, VerifiedGuard, ProfileService, MessagesService],
  entryComponents: [ForgotPasswordDialog, ReviewDialog],
  bootstrap: [AppComponent]
})
export class AppModule {}
