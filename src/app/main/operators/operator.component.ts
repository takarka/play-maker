import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { MessageComponent } from 'src/app/layout/components/message/message.component';
import { UserService } from 'src/app/services/user.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { Role } from 'src/app/shared/services/role';
import { User } from 'src/app/shared/services/user.model';
import { OperatorDialogComponent } from './dialog/operator-dialog.component';

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.scss']
})
export class OperatorComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['No', 'fullName', 'email', 'actions'];

  items: User[] = [];
  dataSource: MatTableDataSource<User> = new MatTableDataSource(this.items);
  itemsChangedSubscription: Subscription;

  currentUser: User = new User();
  usersRole: Role;
  usersTenantId: string;
  usersClubId: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private service: UserService,
    private snackBar: MatSnackBar,
    private navService: NavigationService
  ) {
    this.currentUser = service.getAutenticatedUser();
    const title = this.currentUser.role === Role.Admin ? 'Операторы' : 'Администраторы';
    this.navService.setTitle(title);
    this.usersRole = this.currentUser.role === Role.SuperAdmin ? Role.Admin : Role.Operator;
    this.usersTenantId = this.currentUser.tenantId;
  }

  ngOnInit() {
    if (this.currentUser.role === Role.SuperAdmin) {
      this.itemsChangedSubscription = this.service.getUsersByRole(this.usersRole).subscribe(items => {
        this.dataSource.data = items;
      });
    } else {
      this.itemsChangedSubscription = this.service.getUsersByRoleAndTenantId(this.usersRole, this.usersTenantId).subscribe(items => {
        this.dataSource.data = items;
      });
    }
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

  doEdit(row: User, rowIndex: number) {
    rowIndex = this.dataSource.data.indexOf(row);
    this.openDialog(row, rowIndex);
  }

  openDialog(obj: User, rowIndex: number) {
    const dialogRef = this.dialog.open(OperatorDialogComponent, {
      width: '300px',
      data: {
        row: obj,
        currentUser: this.currentUser
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const user: User = result;
        if (user.id) {
          this.updateOperator(obj, user);
        } else {
          user.activeClubId = this.currentUser.activeClubId == null ? null : this.currentUser.activeClubId;
          this.createNewOperator(user);
        }
      } else {
        console.log('No Result');
      }
    });
  }

  doDelete(user: User) {
    this.service
      .deleteUser(user)
      .then(() => {
        this.openSnackBar(user.id, 'успешно удален!', 'successfull');
      })
      .catch(error => {
        this.openSnackBar(error, 'Ошибка', 'error');
      });
  }

  createNewOperator(newUser: User) {
    this.service
      .createUser(newUser)
      .then(result => {
        this.openSnackBar(newUser.email, 'успешно создан!', 'successfull');
      })
      .catch(error => {
        this.openSnackBar(error, 'Ошибка', 'error');
      });
  }

  updateOperator(user: User, updatedUser: User) {
    this.service
      .updateUser(user, updatedUser)
      .then(() => {
        this.openSnackBar(updatedUser.email, 'успешно обновлено!', 'successfull');
      })
      .catch(error => {
        this.openSnackBar(error, 'Ошибка', 'error');
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
    this.itemsChangedSubscription.unsubscribe();
  }
}
