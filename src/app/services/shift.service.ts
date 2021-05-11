import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Club } from '../main/club/club.model';
import { ShiftStatus } from '../shared/enums/shift-status.enum';
import { Shift } from '../shared/services/shift.model';
import { User } from '../shared/services/user.model';
import { Role } from '../shared/services/role';

@Injectable({
  providedIn: 'root'
})
export class ShiftService implements OnDestroy {
  collectionName = 'shifts';

  private authUserShiftChanged = new Subject<Shift>();
  private startShiftSub: Subscription;

  constructor(public db: AngularFirestore) {}

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

  getCollections(): Observable<Shift[]> {
    return this.db
      .collection<Shift>(this.collectionName)
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

  getShiftsByUserIdAndStatus(userId: string, status: string): Observable<Shift[]> {
    return this.db
      .collection<Shift>(this.collectionName, ref => ref.where('user.id', '==', userId).where('shiftStatus', '==', status))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Shift;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getShiftsByClubIdAndStatus(clubId: string, status: string): Observable<Shift[]> {
    return this.db
      .collection<Shift>(this.collectionName, ref => ref.where('clubId', '==', clubId).where('shiftStatus', '==', status))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Shift;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getOpenedShiftsByClubId(clubId: string): Observable<Shift[]> {
    return this.db
      .collection<Shift>(this.collectionName, ref => ref.where('clubId', '==', clubId).where('shiftStatus', '==', ShiftStatus.OPENED))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Shift;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getShiftsByClubId(clubId: string): Observable<Shift[]> {
    return this.db
      .collection<Shift>(this.collectionName, ref => ref.where('clubId', '==', clubId))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Shift;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  startShift(activeClubId: string) {
    this.startShiftSub = this.getOpenedShiftsByClubId(activeClubId).subscribe(shifts => {
      if (shifts && shifts.length > 0) {
        this.setAuthUserShift(shifts[0]);
      } else {
        this.createNew(activeClubId);
      }
    });
  }

  setAuthUserShift(shift: Shift) {
    sessionStorage.setItem('authUserShift', JSON.stringify(shift));
    this.sendShift(shift);
  }

  getAuthUserShift(): Shift {
    return JSON.parse(sessionStorage.getItem('authUserShift'));
  }

  sendShift(shift: Shift) {
    this.authUserShiftChanged.next(shift);
  }

  clearShift() {
    this.authUserShiftChanged.next();
  }

  getShiftObservable(): Observable<Shift> {
    return this.authUserShiftChanged.asObservable();
  }

  closeActiveShiftAndOpenNew() {
    if (this.startShiftSub) {
      this.startShiftSub.unsubscribe();
    }
    const authUserShift: Shift = this.getAuthUserShift();
    if (authUserShift) {
      authUserShift.closedTime = new Date();
      authUserShift.shiftStatus = ShiftStatus.CLOSED;
      this.update(authUserShift.id, authUserShift);
      this.startShift(authUserShift.clubId);
    }
  }

  private createNew(activeClubId: string) {
    const newShift = new Shift();
    newShift.id = this.db.createId();
    newShift.openedTime = new Date();
    newShift.shiftStatus = ShiftStatus.OPENED;
    newShift.clubId = activeClubId;
    this.setAuthUserShift(newShift);
    this.update(newShift.id, newShift);
  }

  //   searchUsersByAge(value){
  //     return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  //   }

  create(shift: Shift) {
    const id = this.db.createId();
    shift.id = id;
    return this.db
      .collection(this.collectionName)
      .doc(id)
      .set(Object.assign({}, shift));
  }

  ngOnDestroy() {
    if (this.startShiftSub) {
      this.startShiftSub.unsubscribe();
    }
  }
}
