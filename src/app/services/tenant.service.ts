import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tenant } from '../main/tenants/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  collectionName = 'tenants';

  itemsChanged = new Subject<Tenant[]>();

  constructor(public db: AngularFirestore) {}

  update(docKey, value) {
    return this.db
      .collection(this.collectionName)
      .doc(docKey)
      .set(value);
  }

  delete(key) {
    return this.db
      .collection(this.collectionName)
      .doc(key)
      .delete();
  }

  getAll(): Observable<Tenant[]> {
    return this.db
      .collection<Tenant>(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Tenant;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  // getClubsByTenantId(tenantId: string):Observable<Tenant[]>{
  //   return this.db.collection<Tenant>(this.collectionName,ref => ref.where('tenantId', '==', tenantId))
  //     .snapshotChanges().pipe(map(actions => {
  //       return actions.map(a => {
  //         const data = a.payload.doc.data() as Tenant;
  //         const id = a.payload.doc.id;
  //         return { id, ...data };
  //       });
  //     }));
  // }

  create(tenant: Tenant) {
    const id = this.db.createId();
    tenant.id = id;
    return this.db
      .collection(this.collectionName)
      .doc(id)
      .set(tenant);
  }
}
