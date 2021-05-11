import { Injectable } from '@angular/core';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderUIService {
  private o: Order;


  constructor() {}

  set order(o: Order){
      this.o = o;
  }

  get order(){
      return this.o;
  }
}
