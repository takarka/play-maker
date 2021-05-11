import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderArchiveComponent } from './order-archive.component';

const routes: Routes = [
  {
    path: '',
    component: OrderArchiveComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderArchiveRoutingModule {}
