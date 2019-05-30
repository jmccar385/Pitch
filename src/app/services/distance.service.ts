import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm-preview/core';
import { Observable, of, from, forkJoin } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { Venue, Band } from '../models';
import { GeolibInputCoordinates } from 'geolib/es/types';
import { default as getDistance } from 'geolib/es/getDistance';
import { default as isPointWithinRadius } from 'geolib/es/isPointWithinRadius';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class DistanceService {
  private geocoder: any;

  constructor(private mapLoader: MapsAPILoader) {}

  private initGeocoder() {
    if (google && google.maps) {
      this.geocoder = new google.maps.Geocoder();
    }
  }

  private waitForMapsToLoad(): Observable<boolean> {
    if (!this.geocoder) {
      return from(this.mapLoader.load()).pipe(
        tap(() => this.initGeocoder()),
        map(() => true)
      );
    }
    return of(true);
  }

  private geocodeAddress(location: string): Observable<GeolibInputCoordinates> {
    return this.waitForMapsToLoad().pipe(
      switchMap(() => {
        return new Observable(observer => {
          this.geocoder.geocode(
            { address: location },
            (results: any, status: any) => {
              if (status === google.maps.GeocoderStatus.OK) {
                observer.next({
                  latitude: results[0].geometry.location.lat(),
                  longitude: results[0].geometry.location.lng()
                });
              } else {
                observer.next({ latitude: 0, longitude: 0 });
              }
              observer.complete();
            }
          );
        });
      })
    );
  }

  public venueInRadius(bandZip: number, bandRadius: number, venue: Venue) {
    const bandLoc: Observable<GeolibInputCoordinates> = this.geocodeAddress(
      bandZip.toString()
    );
    const venueLoc: Observable<GeolibInputCoordinates> = this.geocodeAddress(
      venue.ProfileAddress
    );

    return forkJoin(bandLoc, venueLoc).toPromise().then(change =>
      isPointWithinRadius(change[1], change[0], bandRadius * 1609.34)
    );
  }

  public calcDistance(bandZip: string, venue: Venue) {
    const bandLoc: Observable<GeolibInputCoordinates> = this.geocodeAddress(
      bandZip.toString()
    );
    const venueLoc: Observable<GeolibInputCoordinates> = this.geocodeAddress(
      venue.ProfileAddress
    );

    forkJoin(bandLoc, venueLoc).subscribe(change => {
      const dist = getDistance(change[1], change[0], 5) / 1609.34;

      return dist;
    });
  }
}
