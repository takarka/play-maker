import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { MessageComponent } from 'src/app/layout/components/message/message.component';
import { TenantService } from 'src/app/services/tenant.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { TenantDialogComponent } from './dialog/tenant-dialog.component';
import { Tenant } from './tenant.model';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss']
})
export class TenantComponent implements OnInit, OnDestroy {
  displayedColumns = ['No', 'name', 'actions'];

  items: Tenant[] = [];
  dataSource: MatTableDataSource<Tenant> = new MatTableDataSource(this.items);
  itemsChangedSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private service: TenantService,
    private snackBar: MatSnackBar,
    private navService: NavigationService
  ) {
    this.navService.setTitle('Организации');
  }

  ngOnInit() {
    this.itemsChangedSubscription = this.service.getAll().subscribe(items => {
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

  doEdit(row: Tenant, rowIndex: number) {
    rowIndex = this.dataSource.data.indexOf(row);
    this.openDialog(row, rowIndex);
  }

  openDialog(obj: Tenant, rowIndex: number) {
    const dialogRef = this.dialog.open(TenantDialogComponent, {
      width: '300px',
      data: {
        row: obj
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const tenant: Tenant = result;
        if (tenant.id) {
          this.service.update(tenant.id, tenant).then(res => {
            this.openSnackBar(tenant.name, 'успешно обновлено!', 'successfull');
          });
        } else {
          this.service.create(tenant).then(res => {
            this.openSnackBar(tenant.name, 'успешно создан!', 'successfull');
          });
        }
      } else {
        console.log('No Result');
      }
    });
  }

  doDelete(row: Tenant) {
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
