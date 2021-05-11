import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HallComponent } from './hall.component';

const routes: Routes = [
    {
        path: '',
        component: HallComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HallRoutingModule {}
