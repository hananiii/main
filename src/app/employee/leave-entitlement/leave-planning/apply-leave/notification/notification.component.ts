import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

/**
 * show pop up notification
 * @export
 * @class NotificationComponent
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
export class NotificationComponent {

  /**
   *Creates an instance of NotificationComponent.
   * @param {*} data
   * @memberof NotificationComponent
   */
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  ngOnInit() {

  }
}