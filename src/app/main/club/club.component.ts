import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { MessageComponent } from 'src/app/layout/components/message/message.component';
import { ClubService } from 'src/app/services/club.service';
import { UserService } from 'src/app/services/user.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { User } from 'src/app/shared/services/user.model';
import { Club } from './club.model';
import { ClubDialogComponent } from './dialog/club-dialog.component';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss']
})
export class ClubComponent implements OnInit, OnDestroy {
  displayedColumns = ['No', 'name', 'address', 'actions'];

  items: Club[] = [];
  dataSource: MatTableDataSource<Club> = new MatTableDataSource(this.items);
  itemsChangedSubscription: Subscription;
  autenticatedUser: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private service: ClubService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private navService: NavigationService
  ) {
    this.navService.setTitle('Клубы');
    // if (this.dataSource.data.length === 1 && !this.autenticatedUser.activeClubId) {
    //   this.userService.updateUserActiveClubId(this.autenticatedUser, this.dataSource.data[0].id);
    // }
  }

  ngOnInit() {
    this.autenticatedUser = this.userService.getAutenticatedUser();
    this.itemsChangedSubscription = this.service.getClubsByTenantId(this.autenticatedUser.tenantId).subscribe(items => {
      this.dataSource.data = items;
      if ((this.autenticatedUser.activeClubId == null || this.autenticatedUser.activeClubId === '') && this.dataSource.data.length > 0) {
        this.userService.updateUserActiveClubId(this.autenticatedUser, this.dataSource.data[0].id);
      }
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

  doEdit(row: Club, rowIndex: number) {
    rowIndex = this.dataSource.data.indexOf(row);
    this.openDialog(row, rowIndex);
  }

  openDialog(obj: Club, rowIndex: number) {
    const dialogRef = this.dialog.open(ClubDialogComponent, {
      width: '450px',
      data: {
        row: obj
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const club: Club = result;
        if (club.id) {
          this.service.update(club.id, result).then(res => {
            this.openSnackBar(club.name, 'успешно обновлено!', 'successfull');
          });
        } else {
          club.tenantId = this.autenticatedUser.tenantId;
          this.service.create(club).then(() => {
            this.openSnackBar(club.name, 'успешно создан!', 'successfull');
          });
        }
      } else {
        console.log('No Result');
      }
    });
  }

  doDelete(row: Club) {
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
