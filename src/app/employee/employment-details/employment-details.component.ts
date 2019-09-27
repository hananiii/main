import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { ActivatedRoute } from '@angular/router';
import { PersonalDetailsService } from '../personal-details/personal-details.service';
import * as _moment from 'moment';
const moment = _moment;

/**
 * Employment Details Page
 * @export
 * @class EmploymentDetailsComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-employment-details',
    templateUrl: './employment-details.component.html',
    styleUrls: ['./employment-details.component.scss'],
})
export class EmploymentDetailsComponent implements OnInit {

    /**
     * This local property is used to get employment details from API
     * @type {*}
     * @memberof EmploymentDetailsComponent
     */
    public list: any;

    /**
     * This local property is used to show progress header
     * @type {boolean}
     * @memberof EmploymentDetailsComponent
     */
    public showHeader: boolean = true;

    /**
     * This local property is used to show profile completeness %
     * @type {number}
     * @memberof EmploymentDetailsComponent
     */
    public progressPercentage: number;

    /**
     * This local property is used to get employment details from API
     * @type {string}
     * @memberof EmploymentDetailsComponent
     */
    public userId: string;

    /**
     * This local property is used to show or hide loading spinner 
     * @type {boolean}
     * @memberof EmploymentDetailsComponent
     */
    public showSpinner: boolean = true;

    /**
     * Local property to show or hide content during loading
     * @type {boolean}
     * @memberof EmploymentDetailsComponent
     */
    public showContent: boolean = false;

    /**
     * details of user list from API
     * @type {*}
     * @memberof EmploymentDetailsComponent
     */
    public data: any;

    /**
     * get filtered superior name
     * @type {string}
     * @memberof EmploymentDetailsComponent
     */
    public reportingName: string;

    /**
     * return API content
     * @readonly
     * @memberof EmploymentDetailsComponent
     */
    get personalList() {
        return this.list;
    }

    /**
     *Creates an instance of EmploymentDetailsComponent.
     * @param {APIService} apiService
     * @param {ActivatedRoute} route
     * @memberof EmploymentDetailsComponent
     */
    constructor(private apiService: APIService,
        private route: ActivatedRoute, private xservice: PersonalDetailsService) {
        route.params.subscribe(params => {
            this.userId = params.id;
        });
        xservice.percentChanged.subscribe(value => {
            this.progressPercentage = value;
        })
    }

    /**
     * Initial method
     * Get employment details content from API
     * @memberof EmploymentDetailsComponent
     */
    ngOnInit() {
        this.apiService.get_employment_details(this.userId).subscribe(
            data => {
                this.list = data;
                this.list.employmentDetail.dateOfJoin = moment(this.list.employmentDetail.dateOfJoin).format('DD-MM-YYYY');
                this.list.employmentDetail.dateOfConfirmation = moment(this.list.employmentDetail.dateOfConfirmation).format('DD-MM-YYYY');
                if (this.list.employmentDetail.dateOfResign === null) {
                    this.list.employmentDetail.dateOfResign = 'NA';
                } else {
                    this.list.employmentDetail.dateOfResign = moment(this.list.employmentDetail.dateOfResign).format('DD-MM-YYYY');
                }
                this.showSpinner = false;
                this.showContent = true;
                this.reporting();
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        )
    }

    /**
     * This method is used to hide header of profile completeness
     * @memberof EmploymentDetailsComponent
     */
    clickToHideHeader() {
        this.showHeader = false;
    }

    /**
     * filter superior name from user id
     * @memberof EmploymentDetailsComponent
     */
    reporting() {
        this.apiService.get_user_profile_list().subscribe(data => {
            this.data = data;
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].userId === this.list.employmentDetail.reportingTo) {
                    this.reportingName = this.data[i].employeeName;
                }
            }
        })
    }

}
