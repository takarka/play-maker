import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { firestore } from 'firebase/app';
import { Subscription } from 'rxjs';
import { MessageComponent } from 'src/app/layout/components/message/message.component';
import { HallService } from 'src/app/services/hall.service';
import { OrderService } from 'src/app/services/order.service';
import { PlaceService } from 'src/app/services/place.service';
import { ShiftService } from 'src/app/services/shift.service';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { LoaderService } from 'src/app/shared/services/leader.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { Role } from 'src/app/shared/services/role';
import { Shift } from 'src/app/shared/services/shift.model';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/services/user.model';
import { Hall } from '../halls/hall.model';
import { Order } from '../orders/order.model';
import { Place } from '../places/place.model';
import { OrderArchiveCompleteDialogComponent } from './complete-dialog/order-complete-dialog.component';
import { OrderArchiveSearch } from './order-archive-search.model';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/shared/services/export.service';
import { OrderToExortDTO } from './order-to-export.model';
import { ShiftStatus } from 'src/app/shared/enums/shift-status.enum';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from 'src/app/layout/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-order-archive',
  templateUrl: './order-archive.component.html',
  styleUrls: ['./order-archive.component.scss']
})
export class OrderArchiveComponent implements OnInit, AfterContentInit, OnDestroy {
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
    private excelService: ExcelService,
    private datePipe: DatePipe
  ) {
    this.autenticatedUser = this.userService.getAutenticatedUser();
    this.autenticatedUserRole = this.autenticatedUser.role;
    this.authUserShift = this.shiftService.getAuthUserShift();
  }

  ngOnInit() {
    this.navService.setTitle('Архив');
    if (this.autenticatedUserRole !== Role.Operator) {
      this.loaderService.show();
      this.authShiftChangedSubscription = this.shiftService
        .getShiftsByClubIdAndStatus(this.autenticatedUser.activeClubId, ShiftStatus.CLOSED)
        .subscribe(shifts => {
          this.shiftIds = shifts.map(s => s.id);
          this.itemsChangedSubscription = this.getAllOrderArchives();
          this.loaderService.hide();
        });
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

  private getAllOrderArchives() {
    this.loaderService.show();
    return this.service.getOrdersByStatus(OrderStatus.CLOSED).subscribe((orders: Order[]) => {
      orders = orders.filter(o => this.shiftIds.includes(o.shiftId));
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

  exportAsXLSX(): void {
    this.loaderService.show();
    const orders: Order[] = this.dataSource.data;
    const ordersToExport: OrderToExortDTO[] = [];
    orders.forEach(order => {
      const dto: OrderToExortDTO = new OrderToExortDTO();
      dto.Создано = this.datePipe.transform(order.openedDate, 'dd/MM/yy - HH:mm');
      dto.Создал = order.openedBy ? order.openedBy.profile.firstName + ' ' + order.openedBy.profile.lastName : '';
      dto.Зал = order.activePlace && order.activePlace.hall ? order.activePlace.hall.name : '';
      // places START
      const placesSet = new Set<string>();
      order.histories.forEach(history => {
        if (history.place) {
          placesSet.add(history.place.name);
        }
      });

      let places = '';
      placesSet.forEach(p => {
        places += places.length === 0 ? p : ', ' + p;
      });
      dto.Месты = places;
      // places END

      const totalSecond = order.duration.totalDuration;
      let minute: number = Math.trunc(totalSecond / 60.0);
      const hour: number = Math.trunc(minute / 60.0);
      minute = minute % 60;
      dto.Время = hour + ' час, ' + minute + ' минут';

      dto.Цена = order.cost.totalCost;
      ordersToExport.push(dto);
    });
    this.loaderService.hide();
    const userName = this.getUserName(this.searchDTO.openedBy);
    this.excelService.exportAsExcelFile(ordersToExport, userName.length > 0 ? userName : 'Все');
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  openDialog(obj: Order) {
    const dialogRef = this.dialog.open(OrderArchiveCompleteDialogComponent, {
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

  doReset() {
    this.searchDTO = new OrderArchiveSearch();
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
