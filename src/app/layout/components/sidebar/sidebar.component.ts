import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/services/user.model';
import { UserService } from 'src/app/services/user.service';
import { Role } from 'src/app/shared/services/role';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    public showMenu: string;
    currentUser: User = new User();
    constructor(private userService: UserService) {
        this.currentUser = this.userService.getAutenticatedUser();
    }

    ngOnInit() {
        this.showMenu = '';
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    get isSuperAdmin() {
        return this.currentUser.role === Role.SuperAdmin;
    }

    get isAdmin() {
        return this.currentUser.role === Role.Admin;
    }

    get isOperator() {
        return this.currentUser.role === Role.Operator;
    }
}
