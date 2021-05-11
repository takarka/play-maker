import { CommonModule, DatePipe } from '@angular/common';
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
import { OrderArchiveRoutingModule } from '../order-archives/order-archive-routing.module';
import { OrderArchiveComponent } from '../order-archives/order-archive.component';
import { OrderArchiveCompleteDialogComponent } from './complete-dialog/order-complete-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    OrderArchiveRoutingModule,
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
    MatTabsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CountdownModule,
    CountdownTimerModule.forRoot()
  ],
  declarations: [OrderArchiveComponent, OrderArchiveCompleteDialogComponent],
  entryComponents: [OrderArchiveCompleteDialogComponent],
  providers: [
    DatePipe
  ]
})
export class OrderArchiveModule {}
