import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { MessageComponent } from '../../layout/components/message/message.component';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/services/user.model';
import { ClubPacket } from './club-packet.model';
import { ClubPacketDialogComponent } from './dialog/club-packet-dialog.component';
import { ClubPacketService } from '../../services/club-packet.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-club-packet',
  templateUrl: './club-packet.component.html',
  styleUrls: ['./club-packet.component.scss']
})
export class ClubPacketComponent implements OnInit, OnDestroy {
  displayedColumns = ['No', 'name', 'hall', 'time', 'cost', 'description', 'actions'];

  items: ClubPacket[] = [];
  dataSource: MatTableDataSource<ClubPacket> = new MatTableDataSource(this.items);
  itemsChangedSubscription: Subscription;
  autenticatedUser: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private service: ClubPacketService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private navService: NavigationService
  ) {
    this.navService.setTitle('Пакеты');
  }

  ngOnInit() {
    this.autenticatedUser = this.userService.getAutenticatedUser();
    this.itemsChangedSubscription = this.service.getClubPacketsByClubId(this.autenticatedUser.activeClubId).subscribe(items => {
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

  doEdit(row: ClubPacket, rowIndex: number) {
    rowIndex = this.dataSource.data.indexOf(row);
    this.openDialog(row, rowIndex);
  }

  openDialog(obj: ClubPacket, rowIndex: number) {
    const dialogRef = this.dialog.open(ClubPacketDialogComponent, {
      width: '300px',
      data: {
        row: obj,
        activeClubId: this.autenticatedUser.activeClubId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const club: ClubPacket = result;
        if (club.id) {
          this.service.update(club.id, result).then(res => {
            this.openSnackBar(club.name, 'успешно обновлено!', 'successfull');
          });
        } else {
          club.clubId = this.autenticatedUser.activeClubId;
          this.service.create(club).then(res => {
            this.openSnackBar(club.name, 'успешно создан!', 'successfull');
          });
        }
      } else {
        console.log('No Result');
      }
    });
  }

  doDelete(row: ClubPacket) {
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
