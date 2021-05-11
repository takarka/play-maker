import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { MessageComponent } from '../../layout/components/message/message.component';
import { PlaceService } from '../../services/place.service';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/services/user.model';
import { Hall } from '../halls/hall.model';
import { PlaceDialogComponent } from './dialog/place-dialog.component';
import { Place } from './place.model';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit, OnDestroy {
  displayedColumns = ['No', 'name', 'hall', 'actions'];

  items: Place[] = [];
  dataSource: MatTableDataSource<Place> = new MatTableDataSource(this.items);
  itemsChangedSubscription: Subscription;

  autenticatedUser: User;
  halls: Hall[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private service: PlaceService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private navService: NavigationService
  ) {
    this.navService.setTitle('Игровая столы');
  }

  ngOnInit() {
    this.autenticatedUser = this.userService.getAutenticatedUser();
    this.itemsChangedSubscription = this.service.getPlacesByClubId(this.autenticatedUser.activeClubId).subscribe(items => {
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

  doEdit(row: Place, rowIndex: number) {
    rowIndex = this.dataSource.data.indexOf(row);
    this.openDialog(row, rowIndex);
  }

  openDialog(obj: Place, rowIndex: number) {
    const dialogRef = this.dialog.open(PlaceDialogComponent, {
      width: '350px',
      data: {
        row: obj,
        activeClubId: this.autenticatedUser.activeClubId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const place: Place = result;
        if (place.id) {
          this.service.update(place.id, result).then(res => {
            this.openSnackBar(place.name, 'успешно обновлено!', 'successfull');
          });
        } else {
          place.clubId = this.autenticatedUser.activeClubId;
          this.service.create(place).then(res => {
            this.openSnackBar(place.name, 'успешно создан!', 'successfull');
          });
        }
      } else {
        console.log('No Result');
      }
    });
  }

  doDelete(row: Place) {
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
    // this.itemsChangedSubscription.unsubscribe();
  }
}
