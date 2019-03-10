import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { combineLatest } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { async } from "q";
import { flatten } from "@angular/compiler";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  constructor(
    private afDatabase: AngularFirestore,
    private afStorage: AngularFireStorage,
    private router: Router
  ) {}

  getArtistObserver() {
    return this.afDatabase.collection("Artists").valueChanges();
  }

  getVenueObserver() {
    return this.afDatabase
      .collection("Venues")
      .snapshotChanges()
      .pipe(
        map(item => {
          return item.map(snapshot => {
            const record = {
              id: snapshot.payload.doc.id,
              ...snapshot.payload.doc.data()
            };

            return [
              this.afDatabase
                .collection(`Venues/${record.id}/AvailableEquipment`)
                .valueChanges()
                .pipe(
                  map(change => {
                    return { ...record, SubCollection: change };
                  })
                ),
              this.afDatabase
                .collection(`Venues/${record.id}/Events`)
                .valueChanges()
                .pipe(
                  map(change => {
                    return { ...record, SubCollection: change };
                  })
                )
            ];
          });
        })
      )
      .pipe(mergeMap(result => {
        let flattened = flatten(result);
        return combineLatest(flattened);
      }));
  }

  // async getEquipment(listID: string) {
  //   return await this.afDatabase.collection("EquipmentList", ref => ref.where("ListID", "==", listID)).get().toPromise();
  // }

  // async getEvents(listID: string) {
  //   return await this.afDatabase.collection("EventsList", ref => ref.where("ListID", "==", listID)).get().toPromise();
  // }

  // async getImages(listID: string) {
  //   return await this.afDatabase.collection("ImagesList", ref => ref.where("ListID", "==", listID)).get().toPromise();
  // }

  // async getImageUrl(ref: any) {
  //   let record = await ref.get();
  //   let image = await this.afStorage.ref(record.data().ImageName);

  //   return await image.getDownloadURL().toPromise();
  // }
}
