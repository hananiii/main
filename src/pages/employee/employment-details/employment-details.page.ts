export enum employeeStatus {
    "Probation",
    "Confirmed",
    "Terminated"
}

import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Employment Details Page
 * @export
 * @class EmploymentDetailsPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-employment-details',
    templateUrl: './employment-details.page.html',
    styleUrls: ['./employment-details.page.scss'],
})
export class EmploymentDetailsPage implements OnInit {

    /**
     * This local property is used to get employment details from API
     * @type {*}
     * @memberof EmploymentDetailsPage
     */
    public list: any;

    /**
     * This local property is used to get employment status from API
     * @type {string}
     * @memberof EmploymentDetailsPage
     */
    public status: string;

    /**
     * This local property is used to show progress header
     * @type {boolean}
     * @memberof EmploymentDetailsPage
     */
    public showHeader: boolean = true;

    /**
     * This local property is used to show profile completeness %
     * @type {number}
     * @memberof EmploymentDetailsPage
     */
    public progressPercentage: number = 80;

    /**
     * This local property is used to get employment details from API
     * @type {string}
     * @memberof EmploymentDetailsPage
     */
    public userId: string;

    /**
     * This local property is used to show or hide loading spinner 
     * @type {boolean}
     * @memberof EmploymentDetailsPage
     */
    public showSpinner: boolean = true;

    /**
     * This local private property is used to set subscription
     * @private
     * @type {Subscription}
     * @memberof EmploymentDetailsPage
     */
    private subscription: Subscription = new Subscription();

    /**
     * return API content
     * @readonly
     * @memberof EmploymentDetailsPage
     */
    get personalList() {
        return this.list;
    }

    /**
     *Creates an instance of EmploymentDetailsPage.
     * @param {APIService} apiService
     * @param {ActivatedRoute} route
     * @memberof EmploymentDetailsPage
     */
    constructor(private apiService: APIService,
        private route: ActivatedRoute) {
    }

    /**
     * Initial method
     * Get employment details content from API
     * @memberof EmploymentDetailsPage
     */
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.userId = params.id;
        });

        this.subscription = this.apiService.get_employment_details(this.userId).subscribe(
            data => {
                this.list = data;
                this.status = employeeStatus[this.list.employmentDetail.employmentStatus];
                this.showSpinner = false;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        )
    }

    /**
     * This method is used to destroy subscription
     * @memberof EmploymentDetailsPage
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * This method is used to hide header of profile completeness
     * @memberof EmploymentDetailsPage
     */
    clickToHideHeader() {
        this.showHeader = false;
    }

}
