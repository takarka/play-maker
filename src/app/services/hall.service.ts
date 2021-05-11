import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hall } from '../main/halls/hall.model';

@Injectable({
  providedIn: 'root'
})
export class HallService {
  collectionName = 'halls';

  itemsChanged = new Subject<Hall[]>();
  private items: Hall[] = [];

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

  getCollections(): Observable<Hall[]> {
    return this.db
      .collection<Hall>(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Hall;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getHallsByClubId(clubId: string): Observable<Hall[]> {
    return this.db
      .collection<Hall>(this.collectionName, ref => ref.where('clubId', '==', clubId))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Hall;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  //   searchUsersByAge(value){
  //     return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  //   }

  create(hall: Hall) {
    const id = this.db.createId();
    hall.id = id;
    return this.db
      .collection(this.collectionName)
      .doc(id)
      .set(Object.assign({}, hall));
  }
}
