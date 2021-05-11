import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftOrderComponent } from './shift-order.component';

const routes: Routes = [
  {
    path: '',
    component: ShiftOrderComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftOrderRoutingModule {}
