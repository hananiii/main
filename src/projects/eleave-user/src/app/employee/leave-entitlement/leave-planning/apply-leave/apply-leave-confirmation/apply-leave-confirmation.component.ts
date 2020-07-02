import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
/**
 * apply leave confirmation page
 * @export
 * @class ApplyLeaveConfirmationComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-apply-leave-confirmation',
  templateUrl: './apply-leave-confirmation.component.html',
  styleUrls: ['./apply-leave-confirmation.component.scss']
})
export class ApplyLeaveConfirmationComponent implements OnInit {

  /**
      *Creates an instance of ApplyLeaveConfirmationComponent.
      * @param {MatDialogRef<ApplyLeaveConfirmationComponent>} dialog reference to a dialog opened
      * @param {*} data data get from inject component
      * @memberof ApplyLeaveConfirmationComponent
      */
  constructor(public dialog: MatDialogRef<ApplyLeaveConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  /**
   * initial method
   * @memberof ApplyLeaveConfirmationComponent
   */
  ngOnInit() {
  }

  /**
   * close dialog
   * @memberof ApplyLeaveConfirmationComponent
   */
  onCloseClick() {
    this.dialog.close();
  }

}
