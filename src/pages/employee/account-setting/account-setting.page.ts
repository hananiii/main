import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Subscription } from 'rxjs';

/**
 * Account Setting Page
 * @export
 * @class AccountSettingPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-account-setting',
    templateUrl: './account-setting.page.html',
    styleUrls: ['./account-setting.page.scss'],
})
export class AccountSettingPage implements OnInit {

    /**
     * This local private property is used to set subscription
     * @private
     * @type {Subscription}
     * @memberof AccountSettingPage
     */
    private subscription: Subscription = new Subscription();

    /**
     *Creates an instance of AccountSettingPage.
     * @param {APIService} apiService
     * @memberof AccountSettingPage
     */
    constructor(private apiService: APIService) { }

    /**
     * Initial method
     * @memberof AccountSettingPage
     */
    ngOnInit() {
        this.subscription = this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                // this.employeeList = data;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );

    }

    /**
     * This method is used to destroy subscription of user profile list
     * @memberof AccountSettingPage
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}