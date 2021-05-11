import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  text = '';
  objName = '';

  constructor(public snackBarRef: MatSnackBarRef<MessageComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.text = data ? data.text : '';
    this.objName = data ? data.objName : '';
  }

  // openSnackBar() {
  //     this.snackBar.openFromComponent(MessageComponent, {
  //         duration: 500
  //     });
  // }

  ngOnInit() {}
}
