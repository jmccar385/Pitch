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
	{ path: 'login', component: LoginComponent },
	{ path: 'profile/:id', component: ProfileComponent },
	{ path: 'profile', component: ProfileComponent },
	{ path: 'settings', component: SettingsComponent },
	{ path: '**', redirectTo: '/login' } // <-- gooby keep this last plz
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
