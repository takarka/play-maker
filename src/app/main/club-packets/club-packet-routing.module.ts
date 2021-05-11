import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClubPacketComponent } from './club-packet.component';

const routes: Routes = [
    {
        path: '',
        component: ClubPacketComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClubPacketRoutingModule {}
