import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from '../layout/components/confirm-dialog/confirm-dialog.component';
import { MessageComponent } from '../layout/components/message/message.component';
import { ProfileDialogComponent } from '../layout/components/profile-dialog/profile-dialog.component';
import { SidebarComponent } from '../layout/components/sidebar/sidebar.component';
import { TopnavComponent } from '../layout/components/topnav/topnav.component';
import { NavComponent } from '../layout/nav/nav.component';
import { AngularMaterialModule } from '../shared/modules/angular-material/angular-material.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, MainRoutingModule, AngularMaterialModule, TranslateModule, FlexLayoutModule, ReactiveFormsModule, ],
  declarations: [
    MainComponent,
    NavComponent,
    TopnavComponent,
    SidebarComponent,
    MessageComponent,
    ConfirmationDialogComponent,
    ProfileDialogComponent
  ],
  entryComponents: [MessageComponent, ConfirmationDialogComponent, ProfileDialogComponent]
})
export class MainModule {}
