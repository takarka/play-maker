import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { firestore } from 'firebase';
import { MessageComponent } from 'src/app/layout/components/message/message.component';
import { OrderService } from 'src/app/services/order.service';
import { OrderHistoryType } from 'src/app/shared/enums/order-history-type.enum';
import { Role } from 'src/app/shared/services/role';
import { OpenTime, Order, OrderHistory } from '../../orders/order.model';

@Component({
  selector: 'app-shift-order-dialog',
  templateUrl: './shift-order-dialog.component.html',
  styleUrls: ['./shift-order-dialog.component.scss'],
  providers: [DatePipe]
})
export class ShiftOrderDialogComponent implements OnInit {
  selectedOrder: Order;
  title: string;

  secondTabSelected = false;

  form: FormGroup;

  activeClubId: string;
  now: Date;

  autenticatedUserRole: string;
  OPERATOR: string = Role.Operator;

  displayedColumns = ['dateTime', 'type', 'data'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ShiftOrderDialogComponent>,
    private snackBar: MatSnackBar,
    private service: OrderService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.selectedOrder) {
      this.selectedOrder = data.selectedOrder;
      this.title = 'Заказ';
    }
    this.fillHistoryTab();
    this.activeClubId = data ? data.activeClubId : null;
    this.autenticatedUserRole = data ? data.role : null;
  }

  fillHistoryTab() {
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
    } else if (row.data.amount) {
      result = row.place.name + ': ' + row.data.name + ' - ' + row.data.amount + ' KZT';
    } else {
      result = row.place.name + ': ' + row.data.name + ' - ' + this.calculateCost(row);
    }
    return result;
  }

  calculateCost(history: OrderHistory) {
    const openTime: OpenTime = history.data;
    if (!openTime.startDate) {
      return '0 KZT';
    }
    if (openTime.startDate instanceof firestore.Timestamp) {
      openTime.startDate = openTime.startDate.toDate();
    }
    const durInSecond = (openTime.startDate.getTime() - this.now.getTime()) / 1000;
    if (durInSecond > 0) {
      if (openTime.primaryTarif) {
        const cost: number = Math.trunc(
          (openTime.primaryTarif.cost * durInSecond) / ((openTime.primaryTarif.time.hour * 60 + openTime.primaryTarif.time.minute) * 60)
        );
        return cost + ' KZT';
      }
    }
    return '0 KZT';
  }

  ngOnInit() {
    this.createForm();
    this.now = new Date();
    this.fillData();
  }

  fillData() {
    const createdByFullName = this.selectedOrder.openedBy
      ? this.selectedOrder.openedBy.profile.firstName + ' ' + this.selectedOrder.openedBy.profile.lastName
      : '';
    const hallName = this.selectedOrder.activePlace ? this.selectedOrder.activePlace.hall.name : '';
    const placesSet = new Set<string>();
    this.selectedOrder.histories.forEach(history => {
      if (history.place) {
        placesSet.add(history.place.name);
      }
    });

    let places = '';
    placesSet.forEach(p => {
      places += p + ', ';
    });

    if (this.selectedOrder.openedDate instanceof firestore.Timestamp) {
      this.selectedOrder.openedDate = this.selectedOrder.openedDate.toDate();
    }
    const openedDate = this.datePipe.transform(this.selectedOrder.openedDate, 'dd/MM/yy - HH:mm');

    if (this.selectedOrder.closedDate instanceof firestore.Timestamp) {
      this.selectedOrder.closedDate = this.selectedOrder.closedDate.toDate();
    }
    const closedDate = this.datePipe.transform(this.selectedOrder.closedDate, 'dd/MM/yy - HH:mm');

    const totalSecond = this.selectedOrder.duration.totalDuration;
    let minute: number = Math.trunc(totalSecond / 60.0);
    const hour: number = Math.trunc(minute / 60.0);
    minute = minute % 60;

    this.fullNameControl.setValue(createdByFullName);
    this.hallNameControl.setValue(hallName);
    this.placeNameControl.setValue(places.slice(0, places.length - 2));
    this.openedDateControl.setValue(openedDate);
    this.closedDateControl.setValue(closedDate);
    this.totalTimeControl.setValue(hour + ' час, ' + minute + ' минут');
    this.totalCostControl.setValue(this.selectedOrder.cost.totalCost + ' KZT');
  }

  createForm() {
    this.form = this.formBuilder.group({
      createdByFullName: [null],
      hallName: [null],
      placeName: [null],
      openedDate: [null],
      closedDate: [null],
      totalTime: [null],
      totalCost: [null]
    });
  }

  get fullNameControl() {
    return this.form.get('createdByFullName');
  }

  get hallNameControl() {
    return this.form.get('hallName');
  }

  get placeNameControl() {
    return this.form.get('placeName');
  }

  get openedDateControl() {
    return this.form.get('openedDate');
  }

  get closedDateControl() {
    return this.form.get('closedDate');
  }

  get totalCostControl() {
    return this.form.get('totalCost');
  }

  get totalTimeControl() {
    return this.form.get('totalTime');
  }

  onOkClick() {
    // this.dialogRef.close(this.selectedOrder);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  tabLabelChanged(event) {
    if (event === 1) {
      this.now = new Date();
      this.secondTabSelected = true;
    } else {
      this.secondTabSelected = false;
    }
  }

  doDelete() {
    this.onNoClick();
    this.service.delete(this.selectedOrder.id).then(
      () => {
        this.openSnackBar('Заказ', 'успешно удалено!', 'successfull');
      },
      err => {
        console.log(err);
      }
    );
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
