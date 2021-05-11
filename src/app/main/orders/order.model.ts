import { User } from 'src/app/shared/services/user.model';
import { Time } from 'src/app/shared/models/time.model';
import { ClubPacket } from '../club-packets/club-packet.model';
import { Place } from '../places/place.model';
import { Tarif } from '../tarifs/tarif.model';

export interface IOrder {
  id?: string;
  code?: string;
  activePlace?: Place;
  activeDetail?: any;
  duration?: OrderDuration;
  cost?: OrderCost;
  histories?: OrderHistory[];
  detailEndTimeList?: number[];
  openedDate?: Date;
  closedDate?: Date;
  openedBy?: User;
  closedBy?: User;
  shiftId?: string;
  orderStatus?: string;
}

export class Order implements IOrder {
  constructor(
    public id?: string,
    public code?: string,
    public activePlace?: Place,
    public activeDetail?: any,
    public duration?: OrderDuration,
    public cost?: OrderCost,
    public histories?: OrderHistory[],
    public detailEndTimeList?: number[],
    public openedDate?: Date,
    public closedDate?: Date,
    public openedBy?: User,
    public closedBy?: User,
    public shiftId?: string,
    public orderStatus?: string
  ) {
    this.id = id ? id : null;
    this.code = code ? code : '';
    this.activePlace = activePlace ? activePlace : null;
    this.activeDetail = activeDetail ? activeDetail : null;
    this.duration = duration ? duration : new OrderDuration();
    this.cost = cost ? cost : new OrderCost();
    this.histories = histories ? histories : [];
    this.detailEndTimeList = detailEndTimeList ? detailEndTimeList : [];
    this.openedDate = openedDate ? openedDate : null;
    this.closedDate = closedDate ? closedDate : null;
    this.openedBy = openedBy ? openedBy : null;
    this.closedBy = closedBy ? closedBy : null;
    this.shiftId = shiftId ? shiftId : null;
    this.orderStatus = orderStatus ? orderStatus : null;
  }
}

export class AmountMoney {
  constructor(public name?: string, public cost?: number, public primaryTarif?: Tarif) {
    this.name = name ? name : 'По деньгам';
    this.cost = cost ? cost : null;
    this.primaryTarif = primaryTarif ? primaryTarif : null;
  }
}

export class OpenTime {
  constructor(public name?: string, public primaryTarif?: Tarif, public startDate?: Date, public endDate?: Date, public cost?: number) {
    this.name = name ? name : 'Открытое время';
    this.primaryTarif = primaryTarif ? primaryTarif : null;
    this.startDate = startDate ? startDate : null;
    this.endDate = endDate ? endDate : null;
    this.cost = cost ? cost : null;
  }
}

export class OrderDetail {
  constructor(
    public place?: Place,
    public detail?: OpenTime | AmountMoney | ClubPacket | Tarif | any,
    public type?: string,
    public startDate?: Date,
    public endDate?: Date,
    public time?: Time,
    public cost?: number,
    public isFinished?: boolean,
    public serialNumber?: number
  ) {
    this.detail = detail ? detail : null;
    this.type = type ? type : null;
    this.startDate = startDate ? startDate : new Date();
    this.endDate = endDate ? endDate : null;
    this.time = time ? time : new Time(0, 0, 0);
    this.cost = cost ? cost : null;
    this.isFinished = isFinished != null ? isFinished : false;
    this.serialNumber = serialNumber != null ? serialNumber : null;
  }
}

export class OrderDuration {
  constructor(
    public startTime?: Date,
    public endTime?: Date,
    public totalDuration?: number,
    public openStartTime?: Date,
    public openEndTime?: Date
  ) {
    this.startTime = startTime ? startTime : null;
    this.endTime = endTime ? endTime : null;
    this.openStartTime = openStartTime ? openStartTime : null;
    this.openEndTime = openEndTime ? openEndTime : null;
    this.totalDuration = totalDuration ? totalDuration : 0; // second
  }
}

export class OrderCost {
  constructor(public totalCost?: number, public openTimeCost?: number) {
    this.totalCost = totalCost ? totalCost : 0;
    this.openTimeCost = openTimeCost ? openTimeCost : 0;
  }
}

export class OrderHistory {
  constructor(public dateTime?: Date, public type?: string, public data?: any, public place?: Place) {
    this.dateTime = dateTime ? dateTime : null;
    this.type = type ? type : null;
    this.data = data ? data : null;
    this.place = place ? place : null;
  }
}
