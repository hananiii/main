import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { EditModeDialogComponent } from '../edit-mode-dialog/edit-mode-dialog.component';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { SnackbarNotificationComponent } from '../snackbar-notification/snackbar-notification.component';
import { SharedService } from '../shared.service';
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
     * show edit profile 
     * @type {boolean}
     * @memberof EmploymentDetailsComponent
     */
    public showEditProfile: boolean = false;

    /**
     * toggle button value
     * @type {string}
     * @memberof EmploymentDetailsComponent
     */
    public modeValue: string = 'OFF';

    /**
     * personal details of this user
     * @type {*}
     * @memberof EmploymentDetailsComponent
     */
    public personalDetail: any;

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
     * @param {ScrollToService} _scrollToService
     * @param {SharedService} sharedService
     * @memberof EmploymentDetailsComponent
     */
    constructor(private apiService: APIService, private route: ActivatedRoute, private _scrollToService: ScrollToService, private sharedService: SharedService) {
        route.params.subscribe(params => {
            this.userId = params.id;
        });
    }

    /**
     * Initial method
     * Get employment details content from API
     * @memberof EmploymentDetailsComponent
     */
    async ngOnInit() {
        let data = await this.apiService.get_employment_details(this.userId).toPromise();
        this.personalDetail = data;
        this.apiService.get_user_info_employment_details().subscribe(
            dataUserDtls => {
                this.list = dataUserDtls;
                this.showSpinner = false;
                this.showContent = true;
                this.reporting();
            },
            error => {
                this.snackbarMsg(JSON.parse(error._body).status, false);
            }
        )
    }


    /**
     * toggle on/off of edit mode
     * @param {*} evt
     * @memberof PersonalDetailsComponent
     */
    mainToggle(evt) {
        if (evt.detail.checked === true) {
            this.modeValue = 'ON';
            this.apiService.matdialog.open(EditModeDialogComponent, {
                data: 'employment',
                height: "225.3px",
                width: "383px",
                panelClass: 'custom-dialog-container'
            });
            const config: ScrollToConfigOptions = {
                target: 'destination'
            };
            this._scrollToService.scrollTo(config);
        } else {
            this.modeValue = 'OFF'
            this.patchEmployment();
        }
        this.sharedService.emitChange(this.modeValue);
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

    /**
     * patch employment details
     * @memberof EmploymentDetailsComponent
     */
    patchEmployment() {
        const body = this.list.employmentDetail;
        body["id"] = this.list.id;
        body.employmentStatus = body.employmentStatus;
        body.employeeId = body.employeeId.toString();
        body.incomeTaxNumber = body.incomeTaxNumber.toString();
        body.bankAccountNumber = body.bankAccountNumber.toString();
        body.dateOfConfirmation = moment(body.dateOfConfirmation).format('YYYY-MM-DD');
        body.dateOfJoin = moment(body.dateOfJoin).format('YYYY-MM-DD');
        body.dateOfResign = moment(body.dateOfResign).format('YYYY-MM-DD');
        this.apiService.patch_user_info_employement_id(body, this.list.id).subscribe(res => {
            this.showEditProfile = false;
            this.snackbarMsg('Edit mode disabled. Good job!', true);
            this.list.employmentDetail = res;
        })
    }

    /**
     * Show notification after submit
     * @param {string} statement
     * @param {boolean} value
     * @memberof EmploymentDetailsComponent
     */
    snackbarMsg(statement: string, value: boolean) {
        this.apiService.snackbar.openFromComponent(SnackbarNotificationComponent, {
            duration: 3000,
            verticalPosition: "top",
            data: { message: statement, response: value }
        });
    }

}
