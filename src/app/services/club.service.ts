import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Club } from '../main/club/club.model';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  collectionName = 'clubs';

  itemsChanged = new Subject<Club[]>();
  private items: Club[] = [];

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

  getCollections(): Observable<Club[]> {
    return this.db
      .collection<Club>(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Club;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getClubsByTenantId(tenantId: string): Observable<Club[]> {
    return this.db
      .collection<Club>(this.collectionName, ref => ref.where('tenantId', '==', tenantId))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Club;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  //   searchUsersByAge(value){
  //     return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  //   }

  create(club: Club) {
    const id = this.db.createId();
    club.id = id;
    return this.db
      .collection(this.collectionName)
      .doc(id)
      .set(Object.assign({}, club));
  }
}
