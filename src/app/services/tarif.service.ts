import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tarif } from '../main/tarifs/tarif.model';

@Injectable({
  providedIn: 'root'
})
export class TarifService {
  collectionName = 'tarifs';

  itemsChanged = new Subject<Tarif[]>();

  constructor(public db: AngularFirestore) {}

  //   getAvatars(){
  //       return this.db.collection('/avatar').valueChanges()
  //   }

  //   getUser(userKey){
  //     return this.db.collection('users').doc(userKey).snapshotChanges();
  //   }

  update(docKey, value) {
    return this.db
      .collection(this.collectionName)
      .doc(docKey)
      .set(Object.assign({}, value));
  }

  delete(key) {
    return this.db
      .collection(this.collectionName)
      .doc(key)
      .delete();
  }

  // getAll(){
  // return this.db.collection(this.collectionName).snapshotChanges();
  // return this.db.collection(this.collectionName).valueChanges();
  // return new Promise<Club>((resolve, reject) => {
  //   this.db.collection(this.collectionName).snapshotChanges()
  //   .subscribe(snapshots => {
  //     resolve(snapshots)
  //   })
  // })
  // }

  // getCollections() {
  //   return this.db.collection(this.collectionName).valueChanges().subscribe((items: Club[])=>{
  //     this.items = items;
  //     this.itemsChanged.next(items);
  //   });
  // }

  getCollections(): Observable<Tarif[]> {
    return this.db
      .collection<Tarif>(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Tarif;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getTarifsByClubId(clubId: string): Observable<Tarif[]> {
    return this.db
      .collection<Tarif>(this.collectionName, ref => ref.where('clubId', '==', clubId))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Tarif;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  searchTarifsByHallAndType(clubId: string, hallId: string, tarifType: string): Observable<Tarif[]> {
    return this.db
      .collection<Tarif>(this.collectionName, ref => ref
        .where('clubId', '==', clubId)
        .where('hall.id', '==', hallId)
        .where('type', '==', tarifType))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Tarif;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  create(tarif: Tarif) {
    const id = this.db.createId();
    tarif.id = id;
    return this.db
      .collection(this.collectionName)
      .doc(id)
      .set(Object.assign({}, tarif));
  }
}
