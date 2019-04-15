import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class VerifiedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private afFirestore: AngularFirestore) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    return this.afFirestore.doc(`Artists/${this.authService.currentUserID}`).get().pipe(
      map(doc => {
        const type = doc.exists ? 'band' : 'venue';
        if (!this.authService.verified) {
          this.router.navigate(['profile', type, this.authService.currentUserID]);
        }
        return this.authService.verified;
      })
    );
  }
}
