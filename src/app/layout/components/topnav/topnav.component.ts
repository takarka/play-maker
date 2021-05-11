import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { RoutingStateService } from 'src/app/shared/services/routing-state.service';
import { ConfirmationDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { ShiftService } from 'src/app/services/shift.service';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit, OnDestroy {
  public pushRightClass: string;

  title = '';
  titleSubscription: Subscription;

  isBack = false;
  backButtonSubscription: Subscription;

  constructor(
    public router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private shiftService: ShiftService,
    private navigationService: NavigationService,
    private routingStateSerive: RoutingStateService,
    private dialog: MatDialog
  ) {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit() {
    this.pushRightClass = 'push-right';

    this.titleSubscription = this.navigationService.getTitle().subscribe(title => {
      this.title = title;
    });

    this.backButtonSubscription = this.navigationService.isBack().subscribe(isBack => {
      this.isBack = isBack;
    });
  }

  goBack() {
    this.router.navigate([this.routingStateSerive.getPreviousUrl()]);
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  onLoggedout() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Вы действительно хотите выйти?'
    });
    dialogRef.afterClosed().subscribe(yes => {
      if (yes) {
        // DO SOMETHING
        this.authService.logout();
      }
    });
  }

  showProfile() {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe(yes => {});
  }

  ngOnDestroy() {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }
}
