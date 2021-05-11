import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ShiftService } from 'src/app/services/shift.service';
import { UserService } from 'src/app/services/user.service';
import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { LoaderService } from './leader.service';
import { Role } from './role';

@Injectable()
export class AuthService implements OnDestroy {
  // authChange = new Subject<boolean>();

  private isAuthenticated = false;
  private authenticatedUser: User = null;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private shiftService: ShiftService,
    private loaderService: LoaderService
  ) {
    /* Saving user data as an object in sessionStorage if logged out than set to null */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // const authUserJSON = JSON.parse(sessionStorage.getItem('autenticatedUser'));
        // const authUserShiftJSON = JSON.parse(sessionStorage.getItem('authUserShift'));
      } else {
        sessionStorage.setItem('authUserShift', null);
        sessionStorage.setItem('autenticatedUser', null);
        sessionStorage.clear();
      }
    });
  }

  login(authData: AuthData) {
    this.loaderService.show();
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.getAuthenticatedUserByUID(result.user.uid);
      })
      .catch(error => {
        this.loaderService.hide();
      });
  }

  logout() {
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
    // this.afAuth.auth.signOut();
    sessionStorage.setItem('previousUrl', null);
    sessionStorage.setItem('currentUrl', null);
    sessionStorage.setItem('autenticatedUser', null);
    sessionStorage.setItem('authUserShift', null);
    sessionStorage.clear();
  }

  isAuth() {
    return this.isAuthenticated;
  }

  public getrouteStateSerivceAutenticatedUser() {
    return this.authenticatedUser ? this.authenticatedUser : new User();
  }

  private getAuthenticatedUserByUID(uid: string) {
    this.userService.getUser(uid).subscribe(user => {
      this.userService.setAutenticatedUser(user);
      if (user.role !== Role.SuperAdmin) {
        this.shiftService.startShift(user.activeClubId);
      }
      this.authSuccessfully();
      this.loaderService.hide();
    });
  }

  public authSuccessfully() {
    this.isAuthenticated = true;
    // const lastUrl = sessionStorage.getItem('currentUrl');
    // console.log('LAST URL: ', lastUrl);
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    sessionStorage.clear();
  }
}
