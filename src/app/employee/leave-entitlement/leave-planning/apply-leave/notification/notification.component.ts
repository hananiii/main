import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

/**
 * show pop up notification
 * @export
 * @class NotificationPage
 */
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styles: [`
      .alert {
        color: #48c353;
      }
    `],
})
export class NotificationPage {

  /**
   *Creates an instance of NotificationPage.
   * @param {*} data
   * @memberof NotificationPage
   */
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  ngOnInit() {

  }
}