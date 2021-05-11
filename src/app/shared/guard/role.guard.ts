import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../services/user.model';
import { UserService } from 'src/app/services/user.service';
import { Role } from '../services/role';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService, private _router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user: User = this.userService.getAutenticatedUser();
    if (next.data.roles && next.data.roles.indexOf(user.role) === -1) {
      // navigate to default page
      user.role === Role.Operator ? this._router.navigate(['/orders']) : this._router.navigate(['/blank-page']);
      return false;
    }

    return true;
  }
}
