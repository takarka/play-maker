import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../main/orders/order.model';
import { ShiftService } from './shift.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  collectionName = 'orders';

  itemsChanged = new Subject<Order[]>();

  constructor(public db: AngularFirestore, private shiftService: ShiftService) {}

  update(docKey: string, order: Order) {
    const histories = order.histories;
    order.histories = histories.map(obj => {
      obj.data = Object.assign({}, obj.data);
      return Object.assign({}, obj);
    });
    order.activeDetail = Object.assign({}, order.activeDetail);
    order.duration = Object.assign({}, order.duration);
    order.cost = Object.assign({}, order.cost);
    order.detailEndTimeList = [];
    order.openedBy = Object.assign({}, order.openedBy);
    order.closedBy = Object.assign({}, order.closedBy);

    return this.db
      .collection(this.collectionName)
      .doc(docKey)
      .set(Object.assign({}, order));
  }

  delete(key) {
    return this.db
      .collection(this.collectionName)
      .doc(key)
      .delete();
  }

  // getCollections() {
  //   return this.db.collection(this.collectionName).valueChanges().subscribe((items: Club[])=>{
  //     this.items = items;
  //     this.itemsChanged.next(items);
  //   });
  // }

  getCollections(): Observable<Order[]> {
    return this.db
      .collection<Order>(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Order;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getOrdersByShiftId(shiftId: string): Observable<Order[]> {
    return this.db
      .collection<Order>(this.collectionName, ref => ref.where('shiftId', '==', shiftId))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Order;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getOrdersByShiftIdAndStatus(shiftId: string, status: string): Observable<Order[]> {
    return this.db
      .collection<Order>(this.collectionName, ref => ref.where('shiftId', '==', shiftId).where('orderStatus', '==', status))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Order;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.db
      .collection<Order>(this.collectionName, ref => ref.where('orderStatus', '==', status))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Order;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  //   searchUsersByAge(value){
  //     return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  //   }

  create(order: Order) {
    const id = this.db.createId();
    order.id = id;
    const histories = order.histories;
    order.histories = histories.map(obj => {
      obj.data = Object.assign({}, obj.data);
      return Object.assign({}, obj);
    });
    order.activeDetail = Object.assign({}, order.activeDetail);
    order.duration = Object.assign({}, order.duration);
    order.cost = Object.assign({}, order.cost);
    order.detailEndTimeList = [];
    order.openedBy = Object.assign({}, order.openedBy);
    order.closedBy = Object.assign({}, order.closedBy);

    return this.db
      .collection(this.collectionName)
      .doc(id)
      .set(Object.assign({}, order));
  }
}
