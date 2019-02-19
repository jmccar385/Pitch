import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatSlideToggleModule, MatToolbarModule, MatCardModule, MatExpansionModule, MatStepperModule, MatBadgeModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatButtonToggleModule, MatGridListModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordDialog } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatCardModule,
    MatExpansionModule,
    MatStepperModule,
    MatBadgeModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  entryComponents: [ForgotPasswordDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
