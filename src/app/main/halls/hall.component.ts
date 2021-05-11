import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { MessageComponent } from 'src/app/layout/components/message/message.component';
import { HallService } from 'src/app/services/hall.service';
import { UserService } from 'src/app/services/user.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { User } from 'src/app/shared/services/user.model';
import { HallDialogComponent } from './dialog/hall-dialog.component';
import { Hall } from './hall.model';
MessageComponent;
@Component({
  selector: 'app-hall',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.scss']
})
export class HallComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['No', 'name', 'actions'];

  items: Hall[] = [];
  dataSource: MatTableDataSource<Hall> = new MatTableDataSource(this.items);
  itemsChangedSubscription: Subscription;
  autenticatedUser: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private service: HallService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private navService: NavigationService
  ) {
    this.navService.setTitle('Залы');
  }

  ngOnInit() {
    this.autenticatedUser = this.userService.getAutenticatedUser();
    this.itemsChangedSubscription = this.service.getHallsByClubId(this.autenticatedUser.activeClubId).subscribe(items => {
      this.dataSource.data = items;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
    this.openDialog(null, null);
  }

  doEdit(row: Hall, rowIndex: number) {
    rowIndex = this.dataSource.data.indexOf(row);
    this.openDialog(row, rowIndex);
  }

  openDialog(obj: Hall, rowIndex: number) {
    const dialogRef = this.dialog.open(HallDialogComponent, {
      width: '300px',
      data: {
        row: obj
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const hall: Hall = result;
        if (hall.id) {
          this.service.update(hall.id, result).then(res => {
            this.openSnackBar(hall.name, 'успешно обновлено!', 'successfull');
          });
        } else {
          hall.clubId = this.autenticatedUser.activeClubId;
          this.service.create(hall).then(res => {
            this.openSnackBar(hall.name, 'успешно создан!', 'successfull');
          });
        }
      } else {
        console.log('No Result');
      }
    });
  }

  doDelete(row: Hall) {
    this.service.delete(row.id).then(
      res => {
        this.openSnackBar(row.name, 'успешно удален!', 'successfull');
      },
      err => {
        console.log(err);
      }
    );
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
    this.itemsChangedSubscription.unsubscribe();
  }
}
