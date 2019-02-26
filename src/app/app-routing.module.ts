import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';

import { LoginComponent } from './login/login.component';
import { BrowseComponent } from './browse/browse.component';
import { SignupComponent } from './signup/signup.component';
import { SignupVenueComponent } from './signupVenue/signupVenue.component';

const routes: Routes = [
	{ path: '', redirectTo: '/browse', pathMatch: 'full' },
	{ path: 'browse', component: BrowseComponent, canActivate: [AuthGuard] },
	{ path: 'signup', component: SignupComponent },
	{ path: 'signupVenue', component: SignupVenueComponent },
	{ path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
