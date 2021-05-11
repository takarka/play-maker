import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Place } from '../main/places/place.model';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  collectionName = 'places';

  itemsChanged = new Subject<Place[]>();

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

  getCollections(): Observable<Place[]> {
    return this.db
      .collection<Place>(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Place;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getPlacesByClubId(clubId: string): Observable<Place[]> {
    return this.db
      .collection<Place>(this.collectionName, ref => ref.where('clubId', '==', clubId))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Place;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  //   loadChatrooms() {
  //     const chatsRef = this.db.collection('places');
  //     return this.observeCollection(chatsRef)
  //         .pipe(
  //             map(chats => {
  //                 return chats.map(chat => {
  //                     return {
  //                         chat,
  //                         members$: this.observeCollection(chat.ref.collection('members')),
  //                         messages$: this.observeCollection(chat.ref.collection('messages')),
  //                     };
  //                 })
  //             }),
  //         );
  // }

  //    // Takes a reference and returns an array of documents
  //     // with the id and reference
  //     private observeCollection(ref) {
  //       return Observable.create((observer) => {
  //           const unsubratingsscribeFn = ref.onSnapshot(
  //               snapshot => {
  //                   observer.next(snapshot.docs.map(doc => {
  //                       const data = doc.data();
  //                       ratings: return {
  //                           ...doc.data(),
  //                           id: doc.id,
  //                           ref: doc.ref
  //                       };
  //                   }));
  //               },
  //               error => observer.error(error),
  //           );

  //           return unsubscribeFn;
  //       });
  //   }

  //   searchUsersByAge(value){
  //     return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  //   }

  create(place: Place) {
    const id = this.db.createId();
    place.id = id;
    return this.db
      .collection(this.collectionName)
      .doc(id)
      .set(Object.assign({}, place));
  }
}
