import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatOptionModule,
  MatPaginatorModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTabsModule
} from '@angular/material';
import { CountdownModule } from 'ngx-countdown';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import { OrderDialogComponent } from './dialog/order-dialog.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { OrderCompleteDialogComponent } from './complete-dialog/order-complete-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatDividerModule,
    MatListModule,
    MatDatepickerModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CountdownModule,
    CountdownTimerModule
  ],
  declarations: [OrderComponent, OrderDialogComponent, OrderCompleteDialogComponent],
  entryComponents: [OrderDialogComponent, OrderCompleteDialogComponent]
})
export class OrderModule {}
