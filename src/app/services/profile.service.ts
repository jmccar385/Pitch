import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";
import { combineLatest } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { flatten } from "@angular/compiler";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  constructor(
    private afDatabase: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}

  uploadImage(input: File) {
    const file = input;
    if (file.type.split("/")[0] !== "image") return;

    const path = `${new Date().getTime()}_${file.name}`;
    let task = this.afStorage.upload(path, file);

    return task.snapshotChanges();
  }

  getArtistObserver() {
    return this.afDatabase.collection("Artists").valueChanges();
  }

  getArtistObserverById(userId: string) {
    return this.afDatabase
      .collection("Artists")
      .doc(userId)
      .get()
      .toPromise();
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
      .pipe(
        mergeMap(result => {
          let flattened = flatten(result);
          return combineLatest(flattened);
        })
      );
  }
}
