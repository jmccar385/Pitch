import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';

import { LoginComponent } from './login/login.component';
import { BrowseComponent } from './browse/browse.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
	{ path: '', redirectTo: '/browse', pathMatch: 'full' },
	{ path: 'browse', component: BrowseComponent, canActivate: [AuthGuard] },
	{ path: 'signup', component: SignupComponent },
	{ path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
