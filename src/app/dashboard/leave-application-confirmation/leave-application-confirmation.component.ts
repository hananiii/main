import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-leave-application-confirmation',
  templateUrl: './leave-application-confirmation.component.html',
  styleUrls: ['./leave-application-confirmation.component.scss']
})
export class LeaveApplicationConfirmationComponent implements OnInit {

  /**
   * reason input value
   * @type {*}
   * @memberof LeaveApplicationConfirmationComponent
   */
  public reason: any;

  /**
   * radio button value (approved/rejected/cancelled)
   * @type {string}
   * @memberof LeaveApplicationConfirmationComponent
   */
  public action: string = 'approved';

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
    this.reason = new FormControl('', Validators.required);
  }

  /**
   * radio button changed (approved/rejected/cancelled)
   * @param {*} event
   * @memberof LeaveApplicationConfirmationComponent
   */
  radioChanged(event) {
    if (event.value != undefined) {
      this.action = event.value;
    }
  }

}
