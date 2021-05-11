import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { firestore } from 'firebase/app';
import { Subscription } from 'rxjs';
import { MessageComponent } from 'src/app/layout/components/message/message.component';
import { OrderService } from 'src/app/services/order.service';
import { ShiftService } from 'src/app/services/shift.service';
import { OrderHistoryType } from 'src/app/shared/enums/order-history-type.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { LoaderService } from 'src/app/shared/services/leader.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { Shift } from 'src/app/shared/services/shift.model';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/services/user.model';
import { OrderDialogComponent } from './dialog/order-dialog.component';
import { Order, OrderHistory } from './order.model';
import { OrderType } from './orderType.enum';
import { OrderCompleteDialogComponent } from './complete-dialog/order-complete-dialog.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, AfterContentInit, OnDestroy {
  displayedColumns = ['No', 'hall', 'place', 'process', 'time', 'cost', 'actions'];

  items: Order[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  itemsChangedSubscription: Subscription;
  authShiftChangedSubscription: Subscription;
  autenticatedUser: User;
  authUserShift: Shift = null;
  STATUS_OPEN: string = OrderStatus.OPENED;

  OPENTIME: string = OrderType.OPEN_TIME;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  nowDate: Date;

  constructor(
    private dialog: MatDialog,
    private service: OrderService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private shiftService: ShiftService,
    private navService: NavigationService,
    private loaderService: LoaderService
  ) {
    this.autenticatedUser = this.userService.getAutenticatedUser();
    this.authUserShift = this.shiftService.getAuthUserShift();
  }

  ngOnInit() {
    this.navService.setTitle('Заказы');
    this.authShiftChangedSubscription = this.shiftService.getShiftObservable().subscribe(shift => {
      this.loaderService.show();
      this.authUserShift = shift;
      this.getOrders();
    });
    if (this.authUserShift) {
      this.loaderService.show();
      this.getOrders();
    }
  }

  private getOrders() {
    this.itemsChangedSubscription = this.service
      .getOrdersByShiftIdAndStatus(this.authUserShift.id, OrderStatus.OPENED)
      .subscribe((orders: Order[]) => {
        this.loaderService.hide();
        this.nowDate = new Date();
        // Convert Timestamp to Date type
        orders.forEach(order => {
          if (order.duration && order.duration.startTime instanceof firestore.Timestamp) {
            order.duration.startTime = order.duration.startTime.toDate();
          }
          if (order.duration && order.duration.endTime instanceof firestore.Timestamp) {
            order.duration.endTime = order.duration.endTime.toDate();
          }

          if (order.duration && order.duration.openStartTime instanceof firestore.Timestamp) {
            order.duration.openStartTime = order.duration.openStartTime.toDate();
          }
          if (order.duration && order.duration.openEndTime instanceof firestore.Timestamp) {
            order.duration.openEndTime = order.duration.openEndTime.toDate();
          }
        });
        this.dataSource.data = orders;
      });
  }

  ngAfterContentInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = function(data: Order, filter: string): boolean {
      const hall = data.activePlace && data.activePlace.hall ? data.activePlace.hall.name : '';
      const place = data.activePlace ? data.activePlace.name : '';
      const process = data.activeDetail ? data.activeDetail.name + '' : '';
      return hall.toLowerCase().includes(filter) || place.toLowerCase().includes(filter) || process.toLowerCase().includes(filter);
    };

    this.dataSource.sortingDataAccessor = (item: Order, property) => {
      switch (property) {
        case 'place': {
          return item.activePlace ? item.activePlace.name : '';
        }
        case 'time': {
          let dur;
          if (item.duration && item.duration.endTime) {
            dur = (item.duration.endTime.getTime() - this.nowDate.getTime()) / 1000;
          } else if (item.duration && item.duration.openStartTime) {
            dur = (this.nowDate.getTime() - item.duration.openStartTime.getTime()) / 1000;
          } else {
            dur = this.nowDate.getTime() / 1000;
          }
          return dur;
        }
        case 'process': {
          return item.activeDetail ? item.activeDetail.name : '';
        }
        case 'cost': {
          return item.cost.totalCost;
        }
        default: {
          return item[property];
        }
      }
    };
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  doNew() {
    this.openDialog(null);
  }

  doExtend(row: Order, rowIndex: number) {
    rowIndex = this.dataSource.data.indexOf(row);
    this.openDialog(row);
  }

  onNotify(e: any) {}

  openDialog(obj: Order) {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '450px',
      data: {
        selectedOrder: obj,
        activeClubId: this.autenticatedUser.activeClubId,
        orders: this.dataSource.data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const order: Order = result;
        if (order.id) {
          this.service.update(order.id, order).then(res => {
            this.openSnackBar('Заказ', 'успешно обновлено!', 'successfull');
          });
        } else {
          order.openedBy = this.autenticatedUser;
          order.shiftId = this.authUserShift.id;
          this.service.create(order).then(res => {
            this.openSnackBar('Заказ', 'успешно создан!', 'successfull');
          });
        }
      } else {
        console.log('No Result');
      }
    });
  }

  isOpenTime(row: Order) {
    return row.duration && row.duration.openStartTime && row.duration.openStartTime.getTime() <= new Date().getTime();
  }

  doClose(row: Order) {
    const now = new Date();
    row.closedDate = now;
    row.closedBy = this.autenticatedUser;
    row.orderStatus = OrderStatus.CLOSED;

    const history = new OrderHistory();
    history.dateTime = now;
    history.type = OrderHistoryType.CLOSED;

    row.histories.push(history);

    if (row.duration.openStartTime) {
      const previewsIndex = row.histories.length - 2;
      const previewsHistory: OrderHistory = row.histories[previewsIndex];
      previewsHistory.data.endDate = now;

      row.activeDetail.endDate = now;
      row.duration.openEndTime = now;
      const durInSecond = (row.duration.openEndTime.getTime() - row.duration.openStartTime.getTime()) / 1000;
      if (durInSecond > 0) {
        row.duration.totalDuration += durInSecond;
        if (row.activeDetail.primaryTarif) {
          const cost: number = Math.trunc(
            (row.activeDetail.primaryTarif.cost * durInSecond) /
              ((row.activeDetail.primaryTarif.time.hour * 60 + row.activeDetail.primaryTarif.time.minute) * 60)
          );
          row.cost.totalCost += cost;
          previewsHistory.data.cost = cost;
        }
      }
      row.histories[previewsIndex] = previewsHistory;
    }

    this.service.update(row.id, row).then(
      () => {
        this.openSnackBar('Заказ', 'успешно закрыто!', 'successfull');
      },
      err => {
        console.log(err);
      }
    );

    this.openCompleteDialog(row);
  }

  openCompleteDialog(obj: Order) {
    const dialogRef = this.dialog.open(OrderCompleteDialogComponent, {
      width: '450px',
      data: {
        selectedOrder: obj,
        activeClubId: this.autenticatedUser.activeClubId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      } else {
        console.log('No Result');
      }
    });
  }

  onFinished() {}

  getCurrent() {
    const data: Order[] = this.dataSource.filteredData.slice();
    const skip = this.paginator.pageSize * this.paginator.pageIndex;
    const paged = data.filter((u, i) => i >= skip).filter((u, i) => i < this.paginator.pageSize);
    return paged;
  }

  getTotalCost() {
    return this.getCurrent()
      .map(t => (t.cost != null ? t.cost.totalCost : 0))
      .reduce((acc, value) => acc + value, 0);
  }

  getCost(row: Order) {
    if (this.isOpenTime(row)) {
      // row.cost ? row.cost.totalCost + ' + ' + getCost(row) : '';
      row.cost.openTimeCost = this.getOpenTimeCost(row);
    }
    return row.cost.totalCost + row.cost.openTimeCost;
  }

  getOpenTimeCost(row: Order) {
    const nowDate = new Date();

    const durInSecond = Math.trunc((nowDate.getTime() - row.duration.openStartTime.getTime()) / 1000);
    if (durInSecond > 0) {
      if (row.activeDetail.primaryTarif) {
        const cost: number = Math.trunc(
          (row.activeDetail.primaryTarif.cost * durInSecond) /
            ((row.activeDetail.primaryTarif.time.hour * 60 + row.activeDetail.primaryTarif.time.minute) * 60)
        );
        row.cost.openTimeCost = cost;
      }
    }
    return row.cost.openTimeCost;
  }

  openSnackBar(objName: string, text: string, messageType: string) {
    this.snackBar.openFromComponent(MessageComponent, {
      data: {
        text: text,
        objName: objName
      },
      panelClass: 'successfull',
      duration: 2000
    });
  }

  ngOnDestroy(): void {
    if (this.itemsChangedSubscription) {
      this.itemsChangedSubscription.unsubscribe();
    }
    if (this.authShiftChangedSubscription) {
      this.authShiftChangedSubscription.unsubscribe();
    }
  }
}
