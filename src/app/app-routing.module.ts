import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';

import { LoginComponent } from './login/login.component';
import { BrowseComponent } from './browse/browse.component';
import { SignupComponent } from './signup/signup.component';
import { SignupVenueComponent } from './signupVenue/signupVenue.component';
import { SignupBandComponent } from './signupBand/signupBand.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
	{ path: '', redirectTo: '/browse', pathMatch: 'full' },
	{ path: 'browse', component: BrowseComponent , canActivate: [AuthGuard] },
	{ path: 'signup', component: SignupComponent },
	{ path: 'signup/band', component: SignupBandComponent },
	{ path: 'signup/venue', component: SignupVenueComponent },
	{ path: 'profile/settings', component: SettingsComponent},
	{ path: 'login', component: LoginComponent },
	{ path: 'profile', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
