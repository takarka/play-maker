import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClubPacket } from '../main/club-packets/club-packet.model';

@Injectable({
  providedIn: 'root'
})
export class ClubPacketService {
  collectionName = 'club-packets';

  // itemsChanged = new Subject<Hall[]>();
  // private items: Hall[] = [];

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

  getCollections(): Observable<ClubPacket[]> {
    return this.db
      .collection<ClubPacket>(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as ClubPacket;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getClubPacketsByClubId(clubId: string): Observable<ClubPacket[]> {
    return this.db
      .collection<ClubPacket>(this.collectionName, ref => ref.where('clubId', '==', clubId))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as ClubPacket;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  //   searchUsersByAge(value){
  //     return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  //   }

  create(packet: ClubPacket) {
    const id = this.db.createId();
    packet.id = id;
    return this.db
      .collection(this.collectionName)
      .doc(id)
      .set(Object.assign({}, packet));
  }
}
