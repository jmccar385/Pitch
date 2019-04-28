import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';
import { VerifiedGuard } from './services/verified.guard';

import { LoginComponent } from './login/login.component';
import { BrowseComponent } from './browse/browse.component';
import { SignupComponent } from './signup/signup.component';
import { SignupVenueComponent } from './signupVenue/signupVenue.component';
import { SignupBandComponent } from './signupBand/signupBand.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { EventSchedulerComponent } from './event-scheduler/event-scheduler.component';

const routes: Routes = [
  { path: '', redirectTo: '/browse', pathMatch: 'full' },
  {
    path: 'browse',
    component: BrowseComponent,
    canActivate: [AuthGuard, VerifiedGuard]
  },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/band', component: SignupBandComponent },
  { path: 'signup/venue', component: SignupVenueComponent },
  {
    path: 'profile/settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'profile/:userType/:id',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: 'events/schedule', component: EventSchedulerComponent },
  { path: '**', redirectTo: '/login' } // <-- gooby keep this last pls
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
