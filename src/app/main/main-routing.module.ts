import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { RoleGuard } from '../shared/guard/role.guard';
import { Role } from '../shared/services/role';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'blank-page',
        loadChildren: './blank-page/blank-page.module#BlankPageModule'
      },
      {
        path: '',
        redirectTo: 'orders'
      },
      {
        path: 'dashboard',
        loadChildren: '../layout/dashboard/dashboard.module#DashboardModule',
        canActivate: [RoleGuard],
        data: { roles: [Role.SuperAdmin, Role.Admin] }
      },
      {
        path: 'clubs',
        loadChildren: './club/club.module#ClubModule',
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin] }
      },
      {
        path: 'operators',
        loadChildren: './operators/operator.module#OperatorModule',
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin, Role.SuperAdmin] }
      },
      {
        path: 'places',
        loadChildren: './places/place.module#PlaceModule',
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin] }
      },
      {
        path: 'club-packets',
        loadChildren: './club-packets/club-packet.module#ClubPacketModule',
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin] }
      },
      {
        path: 'halls',
        loadChildren: './halls/hall.module#HallModule',
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin] }
      },
      {
        path: 'tarifs',
        loadChildren: './tarifs/tarif.module#TarifModule',
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin] }
      },
      {
        path: 'orders',
        loadChildren: './orders/order.module#OrderModule',
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin, Role.Operator] }
      },
      {
        path: 'shift-orders',
        loadChildren: './shift-orders/shift-order.module#ShiftOrderModule',
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin, Role.Operator] }
      },
      {
        path: 'order-archives',
        loadChildren: './order-archives/order-archive.module#OrderArchiveModule',
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin, Role.Operator] }
      },
      // SUPER ADMIN >>>
      {
        path: 'tenants',
        loadChildren: './tenants/tenant.module#TenantModule',
        canActivate: [RoleGuard],
        data: { roles: [Role.SuperAdmin] }
      },
      // SUPER ADMIN <<<
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [RoleGuard]
})
export class MainRoutingModule {}
