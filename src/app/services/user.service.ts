import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../shared/services/user.model';
import { Shift } from '../shared/services/shift.model';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  collectionName = 'users';

  itemsChanged = new Subject<User[]>();
  private items: User[] = [];
  private autenticatedUser: User = null;

  private manageUserAuth: firebase.auth.Auth;

  constructor(public db: AngularFirestore, private afAuth: AngularFireAuth) {
    const secondaryApp = firebase.initializeApp(environment.firebase, 'secondatyApp');
    this.manageUserAuth = secondaryApp.auth();
  }

  createUser(newUser: User) {
    return this.manageUserAuth.createUserWithEmailAndPassword(newUser.email, newUser.password).then(result => {
      newUser.id = result.user.uid;
      this.create(newUser);
      this.userAuthLogout();
    });
  }

  updateUser(user: User, updatedUser: User) {
    return this.manageUserAuth.signInWithEmailAndPassword(user.email, user.password).then(() => {
      this.manageUserAuth.currentUser.updatePassword(updatedUser.password);
      this.update(this.manageUserAuth.currentUser.uid, updatedUser);
    });
  }

  updatePassword(email: string, oldPassword: string, newPassword: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, oldPassword).then(() => {
      this.afAuth.auth.currentUser.updatePassword(newPassword);
    });
  }

  updateProfile(user: User) {
    return this.update(user.id, user);
  }

  deleteUser(user: User) {
    return this.manageUserAuth.signInWithEmailAndPassword(user.email, user.password).then(() => {
      this.manageUserAuth.currentUser.delete();
      this.delete(user.id);
    });
  }

  private userAuthLogout() {
    this.manageUserAuth.signOut();
  }

  setAutenticatedUser(user: User) {
    sessionStorage.setItem('autenticatedUser', JSON.stringify(user));
    this.autenticatedUser = user;
  }

  getAutenticatedUser(): User {
    // return this.autenticatedUser;
    return JSON.parse(sessionStorage.getItem('autenticatedUser'));
  }

  getUser(userKey): Observable<User> {
    return this.db
      .collection<User>('users')
      .doc(userKey)
      .valueChanges();
  }

  updateUserActiveClubId(user: User, clubId: string) {
    user.activeClubId = clubId;
    return this.db
      .collection(this.collectionName)
      .doc(user.id)
      .set(Object.assign({}, user));
  }

  private update(docKey, value) {
    return this.db
      .collection(this.collectionName)
      .doc(docKey)
      .set(Object.assign({}, value));
  }

  private delete(key) {
    return this.db
      .collection(this.collectionName)
      .doc(key)
      .delete();
  }

  getCollections(): Observable<User[]> {
    return this.db
      .collection<User>(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as User;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getUsersByRoleAndTenantId(role: string, tenantId: string): Observable<User[]> {
    return this.db
      .collection<User>(this.collectionName, ref => ref.where('role', '==', role).where('tenantId', '==', tenantId))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as User;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getUsersByRole(role: string): Observable<User[]> {
    return this.db
      .collection<User>(this.collectionName, ref => ref.where('role', '==', role))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as User;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getUsersByClubId(clubId: string): Observable<User[]> {
    return this.db
      .collection<User>(this.collectionName, ref => ref.where('activeClubId', '==', clubId))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as User;
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

  private create(value) {
    // TODO set (value)
    return this.db
      .collection(this.collectionName)
      .doc(value.id)
      .set(Object.assign({}, value));
  }
}
