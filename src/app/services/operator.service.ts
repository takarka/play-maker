import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Operator } from '../main/operators/operator.model';
import { User } from '../shared/services/user.model';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {
  collectionName = 'operators';

  itemsChanged = new Subject<Operator[]>();
  private items: Operator[] = [];

  constructor(public db: AngularFirestore) {}

  //   getAvatars(){
  //       return this.db.collection('/avatar').valueChanges()
  //   }

  getUser(userKey): Observable<Operator> {
    return this.db
      .collection<Operator>(this.collectionName)
      .doc(userKey)
      .valueChanges();
  }

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
  'mFraCG6VCnBKGxQUUaHt';

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

  getCollections(): Observable<Operator[]> {
    return this.db
      .collection<Operator>(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Operator;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getOperatorsByClubId(clubId: string): Observable<Operator[]> {
    return this.db
      .collection<Operator>(this.collectionName, ref => ref.where('clubId', '==', clubId))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Operator;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  //   searchUsers(searchValue){
  //     return this.db.collection('users',ref => ref.where('nameToSearch', '>=', searchValue)
  //       .where('nameToSearch', '<=', searchValue + '\uf8ff'))
  //       .snapshotChanges()
  //   }

  //   searchUsersByAge(value){
  //     return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  //   }

  create(user: User) {
    return this.db.collection(this.collectionName).add(Object.assign({}, user));
  }
}
