import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-leave-application-confirmation',
  templateUrl: './leave-application-confirmation.component.html',
  styleUrls: ['./leave-application-confirmation.component.scss']
})
export class LeaveApplicationConfirmationComponent implements OnInit {

  /**
      *Creates an instance of LeaveApplicationConfirmationComponent.
      * @param {MatDialogRef<LeaveApplicationConfirmationComponent>} dialog reference to a dialog opened
      * @param {*} data data get from inject component
      * @memberof LeaveApplicationConfirmationComponent
      */
  constructor(public dialog: MatDialogRef<LeaveApplicationConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  /**
   * initial method
   * @memberof LeaveApplicationConfirmationComponent
   */
  ngOnInit() {
  }

}
