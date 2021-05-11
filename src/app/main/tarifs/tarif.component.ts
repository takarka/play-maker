import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { MessageComponent } from 'src/app/layout/components/message/message.component';
import { TarifType } from 'src/app/shared/enums/tarifType.enum';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { TarifService } from '../../services/tarif.service';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/services/user.model';
import { TarifDialogComponent } from './dialog/tarif-dialog.component';
import { Tarif } from './tarif.model';
import { PrimaryTarifType } from 'src/app/shared/enums/primary-tarif-type.enum';

@Component({
  selector: 'app-tarif',
  templateUrl: './tarif.component.html',
  styleUrls: ['./tarif.component.scss']
})
export class TarifComponent implements OnInit, OnDestroy {
  displayedColumns = ['No', 'name', 'hall', 'time', 'cost', 'actions'];

  items: Tarif[] = [];
  PRIMARY: string = TarifType.PRIMARY;

  PrimaryType = PrimaryTarifType;

  dataSource: MatTableDataSource<Tarif> = new MatTableDataSource();
  itemsChangedSubscription: Subscription;
  autenticatedUser: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private service: TarifService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private navService: NavigationService
  ) {
    this.navService.setTitle('Тарифы');
  }

  ngOnInit() {
    this.items.filter(t => {
      t.type === TarifType.PRIMARY;
    });
    this.autenticatedUser = this.userService.getAutenticatedUser();
    this.itemsChangedSubscription = this.service.getTarifsByClubId(this.autenticatedUser.activeClubId).subscribe(items => {
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

  doEdit(row: Tarif, rowIndex: number) {
    rowIndex = this.dataSource.data.indexOf(row);
    this.openDialog(row, rowIndex);
  }

  openDialog(obj: Tarif, rowIndex: number) {
    const dialogRef = this.dialog.open(TarifDialogComponent, {
      width: '300px',
      data: {
        row: obj,
        activeClubId: this.autenticatedUser.activeClubId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const tarif: Tarif = result;
        if (tarif.id) {
          this.service.update(tarif.id, result).then(res => {
            this.openSnackBar(tarif.name, 'успешно обновлено!', 'successfull');
          });
        } else {
          // club.clubId = this.autenticatedUser.activeClubId;
          this.service.create(tarif).then(res => {
            this.openSnackBar(tarif.name, 'успешно создан!', 'successfull');
          });
        }
      } else {
        console.log('No Result');
      }
    });
  }

  doDelete(row: Tarif) {
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
