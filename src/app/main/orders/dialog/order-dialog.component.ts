import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatRadioChange, MatSnackBar, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { MessageComponent } from 'src/app/layout/components/message/message.component';
import { ClubPacketService } from 'src/app/services/club-packet.service';
import { PlaceService } from 'src/app/services/place.service';
import { TarifService } from 'src/app/services/tarif.service';
import { OrderHistoryType } from 'src/app/shared/enums/order-history-type.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { TarifType } from 'src/app/shared/enums/tarifType.enum';
import { ViewState } from 'src/app/shared/enums/view-state.enum';
import { Time } from 'src/app/shared/models/time.model';
import { ClubPacket } from '../../club-packets/club-packet.model';
import { Place } from '../../places/place.model';
import { Tarif } from '../../tarifs/tarif.model';
import { AmountMoney, OpenTime, Order, OrderHistory } from '../order.model';
import { OrderType } from '../orderType.enum';
import { firestore } from 'firebase';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss']
})
export class OrderDialogComponent implements OnInit {
  selectedOrder: Order;
  selectedPlace: Place;
  title: string;
  okButtonTitle: string;
  createdByFullName = '';
  hallName = '';
  viewState: string;
  NEW = ViewState.NEW;

  selectedOptionType: string;
  TARIF: string = OrderType.TARIF;
  PACKET: string = OrderType.PACKET;
  AMOUNT: string = OrderType.AMOUNT;
  OPENTIME: string = OrderType.OPEN_TIME;
  OPDERSTATUS = OrderStatus;

  isLastDetailOpenTime = false;
  secondTabSelected = false;
  isOrderClosed: boolean;

  form: FormGroup;

  tarifs: any[] = [];
  packets: any[] = [];

  activeClubId: string;
  hasPrimaryTarif = false;
  primaryTarif: Tarif;

  places: any[] = [];

  allUsedPlaceIds: string[] = [];
  allPlaces: Place[] = [];
  allTarif: Tarif[] = [];
  allPacket: ClubPacket[] = [];

  displayedColumns = ['dateTime', 'type', 'data'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    private snackBar: MatSnackBar,
    private service: OrderService,
    private tarifService: TarifService,
    private packetService: ClubPacketService,
    private placeService: PlaceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.selectedOrder) {
      this.viewState = ViewState.EDIT;
      this.selectedOrder = data.selectedOrder;
      this.selectedPlace = this.selectedOrder.activePlace;
      this.title = 'Заказ';
      if (data.selectedOrder.activeDetail && data.selectedOrder.activeDetail.name === 'Открытое время') {
        this.isLastDetailOpenTime = true;
      }
      this.isOrderClosed = this.selectedOrder.orderStatus === OrderStatus.CLOSED ? true : false;

      this.okButtonTitle = 'Изменить место';
    } else {
      this.viewState = ViewState.NEW;
      this.selectedOrder = new Order();
      this.selectedOrder.orderStatus = OrderStatus.OPENED;
      this.title = 'Создать новый заказ';
      this.okButtonTitle = 'Сохранить';
    }
    this.findAllUsedPlaces(data ? data.orders : []);
    this.fillHistoryTab();
    this.selectedOptionType = OrderType.TARIF;
    this.activeClubId = data ? data.activeClubId : null;
  }

  findAllUsedPlaces(orders: Order[]) {
    if (orders && orders.length > 0) {
      this.allUsedPlaceIds = orders.filter(o => o.id !== this.selectedOrder.id).map(o => o.activePlace.id);
    } else {
      this.allUsedPlaceIds = [];
    }
  }

  fillHistoryTab() {
    this.createdByFullName = this.selectedOrder.openedBy
      ? this.selectedOrder.openedBy.profile.firstName + ' ' + this.selectedOrder.openedBy.profile.lastName
      : '';

    this.hallName = this.selectedOrder.activePlace ? this.selectedOrder.activePlace.hall.name : '';

    this.selectedOrder.histories.forEach(history => {
      if (history.dateTime instanceof firestore.Timestamp) {
        history.dateTime = history.dateTime.toDate();
      }
    });
    this.dataSource.data = this.selectedOrder.histories;
  }

  getDataInfo(row: OrderHistory) {
    let result = '';
    if (!row.data || !row.place) {
      // row.type === OrderHistoryType.CLOSED
      return '';
    }
    if (row.type === OrderHistoryType.PLACE_CHANGED) {
      result = row.place.name + ' -> ' + row.data.name;
    } else if (row.data.cost) {
      result = row.place.name + ': ' + row.data.name + ' - ' + row.data.cost + ' KZT';
    } else {
      result = row.place.name + ': ' + row.data.name;
    }
    return result;
  }


  ngOnInit() {
    this.placeService.getPlacesByClubId(this.activeClubId).subscribe(items => {
      this.allPlaces = items.sort((p1, p2) => {
        if (p1.hall.id > p2.hall.id) {
          return 1;
        }

        if (p1.hall.id < p2.hall.id) {
          return -1;
        }

        return 0;
      });

      if (this.viewState === ViewState.EDIT) {
        this.places = items.filter(p => p.hall.id === this.selectedPlace.hall.id).slice();
      } else {
        this.places = items.slice();
      }
      this.places.forEach(p => {
        p.isFree = this.allUsedPlaceIds.includes(p.id) ? false : true;
      });
    });

    this.tarifService.getTarifsByClubId(this.activeClubId).subscribe(items => {
      this.allTarif = items;
      this.checkPlace();
    });

    this.packetService.getClubPacketsByClubId(this.activeClubId).subscribe(items => {
      this.allPacket = items;
      this.checkPlace();
    });

    this.createForm();
    this.changeOrderType();

    this.placeControl.patchValue(this.selectedPlace);
  }

  createForm() {
    this.form = this.formBuilder.group({
      place: [null, Validators.required],
      tarif: [null, Validators.required],
      packet: [null, Validators.required],
      amount: [null, Validators.required],
      openTime: this.formBuilder.group({
        costPerHour: [null],
        startDate: [null],
        startTime: [null],
        endDate: [null],
        endTime: [null],
        description: [null]
      }),
      time: this.formBuilder.group({
        hour: [0],
        minute: [0],
        second: [0]
      }),
      cost: [null]
    });
  }

  get placeControl() {
    return this.form.get('place');
  }

  get tarifControl() {
    return this.form.get('tarif');
  }

  get packetControl() {
    return this.form.get('packet');
  }

  get amountControl() {
    return this.form.get('amount');
  }

  get openTimeControl() {
    return this.form.get('openTime');
  }

  get costControl() {
    return this.form.get('cost');
  }

  get timeControl() {
    return this.form.get('time');
  }

  onChange(mrChange: MatRadioChange) {
    this.selectedOptionType = mrChange.value;

    this.tarifControl.reset();
    this.packetControl.reset();
    this.amountControl.reset();
    this.openTimeControl.reset();

    this.costControl.reset();
    this.timeControl.reset();

    this.changeOrderType();
  }

  changeOrderType() {
    this.tarifControl.disable();
    this.packetControl.disable();
    this.amountControl.disable();
    this.openTimeControl.disable();

    if (this.isLastDetailOpenTime) {
      return;
    }

    if (this.selectedOptionType === this.TARIF) {
      this.tarifControl.enable();
      if (this.viewState === ViewState.NEW) {
        this.okButtonTitle = 'Сохранить';
        this.tarifControl.setValidators([Validators.required]);
      } else {
        this.okButtonTitle = 'Изменить место';
        this.tarifControl.setValidators([]);
      }
    } else if (this.selectedOptionType === this.PACKET) {
      this.packetControl.enable();
      if (this.viewState === ViewState.NEW) {
        this.okButtonTitle = 'Сохранить';
        this.packetControl.setValidators([Validators.required]);
      } else {
        this.okButtonTitle = 'Изменить место';
        this.packetControl.setValidators([]);
      }
    } else if (this.selectedOptionType === this.AMOUNT) {
      this.amountControl.enable();
      if (this.viewState === ViewState.NEW) {
        this.okButtonTitle = 'Сохранить';
        this.amountControl.setValidators([Validators.required]);
      } else {
        this.okButtonTitle = 'Изменить место';
        this.packetControl.setValidators([]);
      }
    } else if (this.selectedOptionType === this.OPENTIME) {
      this.openTimeControl.enable();
      this.form.markAsDirty();
      this.okButtonTitle = this.viewState === ViewState.NEW ? 'Сохранить' : 'Продлить';

      const now = new Date();
      this.openTimeControl.patchValue({
        startDate: now,
        startTime: now.getHours() + ':' + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()),
        endDate: null,
        endTime: null,
        description: this.hasPrimaryTarif ? this.primaryTarif.cost + ' KZT' : ''
      });
    }
  }

  placeSelected(e: any) {
    this.selectedPlace = e.value;
    if (this.selectedOrder.activePlace && this.selectedPlace.id === this.selectedOrder.activePlace.id) {
      this.selectedPlace = null;
    }
    this.checkPlace();
  }

  checkPlace() {
    if (this.selectedPlace == null) {
      return;
    }
    this.packets = this.allPacket.filter(i => i.hall.id === this.selectedPlace.hall.id);
    this.tarifs = this.allTarif.filter(i => i.hall.id === this.selectedPlace.hall.id);

    const primaryTarifOfSelectedHall: Tarif[] = this.tarifs.filter(t => t.type === TarifType.PRIMARY);
    if (primaryTarifOfSelectedHall.length === 0) {
      this.openSnackBar('"' + this.selectedPlace.hall.name + '" ', 'этому залу не установлен минимальный тариф', 'successfull');
      this.hasPrimaryTarif = false;
    } else {
      this.hasPrimaryTarif = true;
      this.primaryTarif = primaryTarifOfSelectedHall[0];
    }
  }

  tarifSelected(tarif: Tarif) {
    this.timeControl.patchValue(tarif.time);
    this.costControl.setValue(tarif.cost);
    this.okButtonTitle = this.viewState === ViewState.NEW ? 'Сохранить' : 'Продлить';
  }

  packetSelected(packet: ClubPacket) {
    this.timeControl.patchValue(packet.time);
    this.costControl.setValue(packet.cost);
    this.okButtonTitle = this.viewState === ViewState.NEW ? 'Сохранить' : 'Продлить';
  }

  amountChanged() {
    this.amountControl.valueChanges.subscribe((amount: number) => {
      this.timeControl.reset();
      this.setTime(amount);
      this.costControl.setValue(amount);
    });
    this.okButtonTitle = this.viewState === ViewState.NEW ? 'Сохранить' : 'Продлить';
  }

  setTime(amount: number) {
    if (this.hasPrimaryTarif) {
      const totalMinute: number = Math.trunc(
        (amount * (this.primaryTarif.time.hour * 60 + this.primaryTarif.time.minute)) / this.primaryTarif.cost
      );
      const hour: number = Math.trunc(totalMinute / 60.0);
      const minute: number = totalMinute % 60;
      this.timeControl.setValue(new Time(hour, minute, 0));
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onOkClick() {
    let detail;

    if (this.selectedOptionType === OrderType.TARIF) {
      detail = this.tarifControl.value;
    } else if (this.selectedOptionType === OrderType.PACKET) {
      detail = this.packetControl.value;
    } else if (this.selectedOptionType === OrderType.AMOUNT) {
      detail = new AmountMoney(null, this.amountControl.value, this.primaryTarif);
    } else if (this.selectedOptionType === OrderType.OPEN_TIME) {
      detail = new OpenTime(null, this.primaryTarif, null, null);
    }

    const now = new Date();
    const history = new OrderHistory();
    history.dateTime = now;

    if (detail) {
      if (detail instanceof OpenTime) {
        detail.startDate = now;

        if (this.selectedOrder.duration.endTime > now) {
          // is not expired
          this.selectedOrder.duration.openStartTime = this.selectedOrder.duration.endTime;
        } else {
          // is expired
          this.selectedOrder.duration.openStartTime = now;
        }
      } else {
        const time: Time = this.timeControl.value;
        const h = time.hour;
        const m = time.minute;
        // TODO START TIME
        if (this.selectedOrder.duration.endTime > now) {
          this.selectedOrder.duration.endTime = new Date(this.selectedOrder.duration.endTime.getTime() + 1000 * 60 * (m + h * 60));
        } else {
          this.selectedOrder.duration.endTime = new Date(now.getTime() + 1000 * 60 * (m + h * 60));
        }
        this.selectedOrder.duration.startTime = null;
        this.selectedOrder.duration.totalDuration += 60 * (m + h * 60);

        const cost: number = this.costControl.value;
        this.selectedOrder.cost.totalCost += cost;
      }

      if (this.viewState === ViewState.NEW) {
        this.selectedOrder.openedDate = now;
        history.type = OrderHistoryType.OPENED;
      } else {
        history.type = OrderHistoryType.METHOD_CHANGED;
      }

      history.data = detail;
      history.place = this.selectedPlace;
    } else {
      history.type = OrderHistoryType.PLACE_CHANGED;
      history.data = this.selectedPlace;
      history.place = this.selectedOrder.activePlace;
    }

    this.selectedOrder.histories.push(history);
    this.selectedOrder.activePlace = this.selectedPlace;
    this.selectedOrder.activeDetail = detail ? detail : this.selectedOrder.activeDetail;
    this.selectedOrder.code = now.getTime() + '';

    this.dialogRef.close(this.selectedOrder);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  tabLabelChanged(event) {
    if (event === 1) {
      this.secondTabSelected = true;
    } else {
      this.secondTabSelected = false;
    }
  }

  openSnackBar(objName: string, text: string, messageType: string) {
    setTimeout(() => {
      this.snackBar.openFromComponent(MessageComponent, {
        data: {
          text: text,
          objName: objName
        },
        panelClass: 'successfull',
        duration: 2000
      });
    });
  }
}
