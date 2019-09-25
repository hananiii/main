import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';

/**
 * Leave Planning Page
 * @export
 * @class LeavePlanningPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-leave-planning',
    templateUrl: './leave-planning.page.html',
    styleUrls: ['./leave-planning.page.scss'],
})
export class LeavePlanningPage implements OnInit {

    /**
     * This local property is used to get personal details from API
     * @type {*}
     * @memberof LeavePlanningPage
     */
    public list: any;

    /**
     * This local property is used to show or hide spinner
     * @type {boolean}
     * @memberof LeavePlanningPage
     */
    public showSpinner: boolean = true;

    /**
     *Creates an instance of LeavePlanningPage.
     * @param {APIService} API
     * @param {Router} router
     * @memberof LeavePlanningPage
     */
    constructor(private API: APIService, private router: Router
    ) { }

    /**
     * Initial method
     * Get personal details from API
     * @memberof LeavePlanningPage
     */
    ngOnInit() {
        this.API.get_user_profile().subscribe(
            (list: any[]) => {
                this.showSpinner = false;
                this.list = list;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    /**
     * This method is used to route to the personal leave entitlement page
     * @memberof LeavePlanningPage
     */
    backToProfile() {
        this.router.navigate(['/main/employee-setup/leave-entitlement']);
    }
}