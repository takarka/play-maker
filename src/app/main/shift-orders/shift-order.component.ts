import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { firestore } from 'firebase/app';
import { Subscription } from 'rxjs';
import { MessageComponent } from 'src/app/layout/components/message/message.component';
import { HallService } from 'src/app/services/hall.service';
import { OrderService } from 'src/app/services/order.service';
import { PlaceService } from 'src/app/services/place.service';
import { ShiftService } from 'src/app/services/shift.service';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { ExcelService } from 'src/app/shared/services/export.service';
import { LoaderService } from 'src/app/shared/services/leader.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { Role } from 'src/app/shared/services/role';
import { Shift } from 'src/app/shared/services/shift.model';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/services/user.model';
import { Hall } from '../halls/hall.model';
import { OrderArchiveSearch } from '../order-archives/order-archive-search.model';
import { OrderToExortDTO } from '../order-archives/order-to-export.model';
import { Order } from '../orders/order.model';
import { Place } from '../places/place.model';
import { ShiftOrderDialogComponent } from './complete-dialog/shift-order-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/layout/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-shift-order',
  templateUrl: './shift-order.component.html',
  styleUrls: ['./shift-order.component.scss']
})
export class ShiftOrderComponent implements OnInit, AfterContentInit, OnDestroy {
  displayedColumns = ['No', 'openedDate', 'hall', 'openedBy', 'time', 'cost', 'actions'];

  @ViewChild('TABLE') table: ElementRef;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  allOrderArchives: Order[] = [];
  itemsChangedSubscription: Subscription;
  authShiftChangedSubscription: Subscription;
  autenticatedUser: User;
  autenticatedUserRole: string;
  authUserShift: Shift = null;
  STATUS_OPEN: string = OrderStatus.OPENED;
  OPERATOR: string = Role.Operator;

  halls: Hall[];
  allPlaces: Place[];
  places: Place[];

  shiftIds: string[] = [];

  users: User[];

  searchDTO = new OrderArchiveSearch();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  nowDate: Date;

  openedOrders: number;

  constructor(
    private dialog: MatDialog,
    private service: OrderService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private shiftService: ShiftService,
    private hallService: HallService,
    private placeService: PlaceService,
    private navService: NavigationService,
    private loaderService: LoaderService,
    private excelService: ExcelService
  ) {
    this.autenticatedUser = this.userService.getAutenticatedUser();
    this.autenticatedUserRole = this.autenticatedUser.role;
    this.authUserShift = this.shiftService.getAuthUserShift();
  }

  ngOnInit() {
    this.navService.setTitle('Завершенные заказы');

    this.authShiftChangedSubscription = this.shiftService.getShiftObservable().subscribe(shift => {
      this.loaderService.show();
      this.authUserShift = shift;
      this.itemsChangedSubscription = this.getOrderArchives();
    });
    if (this.authUserShift) {
      this.loaderService.show();
      this.itemsChangedSubscription = this.getOrderArchives();
    }

    this.placeService.getPlacesByClubId(this.autenticatedUser.activeClubId).subscribe(places => {
      this.allPlaces = places.sort((p1, p2) => {
        if (p1.hall.id > p2.hall.id) {
          return 1;
        }

        if (p1.hall.id < p2.hall.id) {
          return -1;
        }

        return 0;
      });
      this.places = this.allPlaces;
    });

    this.hallService.getHallsByClubId(this.autenticatedUser.activeClubId).subscribe(halls => {
      this.halls = halls;
    });

    this.userService.getUsersByClubId(this.autenticatedUser.activeClubId).subscribe(users => {
      this.users = users;
    });
  }

  private getOrderArchives(): Subscription {
    return this.service.getOrdersByShiftIdAndStatus(this.authUserShift.id, OrderStatus.CLOSED).subscribe((orders: Order[]) => {
      this.nowDate = new Date();
      // Convert Timestamp to Date type
      orders.forEach(order => {
        if (order.duration && order.duration.startTime instanceof firestore.Timestamp) {
          order.duration.startTime = order.duration.startTime.toDate();
        }
        if (order.duration && order.duration.endTime instanceof firestore.Timestamp) {
          order.duration.endTime = order.duration.endTime.toDate();
        }

        if (order.openedDate instanceof firestore.Timestamp) {
          order.openedDate = order.openedDate.toDate();
        }
      });
      this.allOrderArchives = orders;
      this.dataSource.data = this.allOrderArchives.slice();
      this.loaderService.hide();
    });
  }

  ngAfterContentInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = function(data: Order, filter: string): boolean {
      const hall = data.activePlace && data.activePlace.hall ? data.activePlace.hall.name : '';
      const place = data.activePlace ? data.activePlace.name : '';
      const time = data.duration ? data.duration.totalDuration + '' : '';
      const cost = data.cost ? data.cost.totalCost + '' : '';
      return (
        hall.toLowerCase().includes(filter) ||
        place.toLowerCase().includes(filter) ||
        time.toLowerCase().includes(filter) ||
        cost.toLowerCase().includes(filter)
      );
    };

    this.dataSource.sortingDataAccessor = (item: Order, property) => {
      switch (property) {
        case 'place': {
          return item.activePlace ? item.activePlace.name : '';
        }
        case 'time': {
          let dur;
          if (item.duration.endTime) {
            dur = (item.duration.endTime.getTime() - this.nowDate.getTime()) / 1000;
          } else {
            dur = this.nowDate.getTime() / 1000;
          }
          return dur;
        }
        case 'cost': {
          return item.cost.totalCost;
        }
        case 'openedDate': {
          return item.closedDate ? item.openedDate.getTime() : 0;
        }
        case 'hall': {
          return item.activePlace ? item.activePlace.hall.name : '';
        }
        case 'openedBy': {
          return this.getOpenedByName(item);
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

  doDetail(row: Order) {
    this.openDialog(row);
  }

  doSearch() {
    this.loaderService.show();
    this.dataSource.data = this.allOrderArchives.filter((order: Order) => {
      if (this.searchDTO.startDate && this.searchDTO.startDate.getTime() > order.openedDate.getTime()) {
        return false;
      }
      if (this.searchDTO.endDate) {
        this.searchDTO.endDate.setHours(23);
        this.searchDTO.endDate.setMinutes(59);
        this.searchDTO.endDate.setSeconds(59);
        this.searchDTO.endDate.setMilliseconds(999);
        if (this.searchDTO.endDate.getTime() < order.openedDate.getTime()) {
          return false;
        }
      }
      if (this.searchDTO.hall && this.searchDTO.hall.id !== order.activePlace.hall.id) {
        return false;
      }
      if (this.searchDTO.openedBy && this.searchDTO.openedBy.id !== order.openedBy.id) {
        return false;
      }
      return true;
    });
    this.loaderService.hide();
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  openDialog(obj: Order) {
    const dialogRef = this.dialog.open(ShiftOrderDialogComponent, {
      width: '430px',
      data: {
        selectedOrder: obj,
        activeClubId: this.autenticatedUser.activeClubId,
        role: this.autenticatedUserRole
      }
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  doDelete(row: Order) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Вы действительно хотите удалить?'
    });
    dialogRef.afterClosed().subscribe(yes => {
      if (yes) {
        // DO SOMETHING
        this.service.delete(row.id).then(
          () => {
            this.openSnackBar('Заказ', 'успешно удалено!', 'successfull');
          },
          err => {
            console.log(err);
          }
        );
      }
    });
  }

  getCurrent() {
    const startIndex: number = this.paginator.pageSize * this.paginator.pageIndex;
    const endIndex: number = this.paginator.pageSize + startIndex;

    let array: Order[] = [];

    array = this.dataSource._orderData(this.dataSource.data);

    return array.slice(startIndex, endIndex);
  }

  getOpenedByName(row: Order) {
    return row.openedBy && row.openedBy.profile ? row.openedBy.profile.firstName : '';
  }

  getUserName(user: User) {
    return user && user.profile ? user.profile.firstName : '';
  }

  getTotalCost() {
    return this.dataSource.data.map(t => (t.cost != null ? t.cost.totalCost : 0)).reduce((acc, value) => acc + value, 0);
  }

  hallSelected(value: Hall) {
    this.searchDTO.place = null;
    this.places = value ? this.allPlaces.filter(p => p.hall.id === value.id) : this.allPlaces;
  }

  onCompleteShift() {
    this.openedOrders = 0;
    this.service.getOrdersByShiftIdAndStatus(this.authUserShift.id, OrderStatus.OPENED).subscribe(result => {
      this.openedOrders = result.length;
    });
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Вы действительно хотите закрыть смену?'
    });
    dialogRef.afterClosed().subscribe(yes => {
      if (yes) {
        if (this.openedOrders > 0) {
          this.openSnackBar('', 'У вас есть открытые заказы, сначала закройте все заказы!', 'successfull');
        } else {
          this.shiftService.closeActiveShiftAndOpenNew();
          this.openSnackBar('', 'Смена успешно закрыто!', 'successfull');
        }
      }
    });
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
