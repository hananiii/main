import { Component, OnInit, HostBinding } from '@angular/core';
import { DashboardApiService } from './dashboard-api.service';
import * as _moment from 'moment';
import { MenuController } from '@ionic/angular';
import { MatDialog } from '@angular/material';
import { LeaveApplicationConfirmationComponent } from './leave-application-confirmation/leave-application-confirmation.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
const moment = _moment;

/**
 * Dashboard Page
 * @export
 * @class DashboardComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

    /**
     * This local property is used to show or hide spinner
     * @type {boolean}
     * @memberof LeavePlanningPage
     */
    public showSpinner: boolean = true;

    /**
     * Show dashboard content
     * @type {boolean}
     * @memberof DashboardComponent
     */
    public row: boolean = false;

    /**
     * upcoming holiday list
     * @type {*}
     * @memberof DashboardComponent
     */
    public holidays: any;

    /**
     * announcements list
     * @type {*}
     * @memberof DashboardComponent
     */
    public announcements: any;

    /**
     * show all holiday 
     * @type {boolean}
     * @memberof DashboardComponent
     */
    public showall: boolean = false;

    /**
     * show holiday view less button
     * @type {boolean}
     * @memberof DashboardComponent
     */
    public showViewLessButton: boolean = false;

    /**
     * show all announcements
     * @type {boolean}
     * @memberof DashboardComponent
     */
    public showallannouncement: boolean = false;

    /**
     * click to view less message 
     * @type {boolean}
     * @memberof DashboardComponent
     */
    public viewLessAnnouncement: boolean = false;

    /** 
     * annual leave details
     * @type {number}
     * @memberof DashboardComponent
     */
    public annualVal: any;

    /**
     * medical leave details
     * @type {number}
     * @memberof DashboardComponent
     */
    public medicalVal: any = 0;

    /**
     * replacement leave
     * @type {number}
     * @memberof DashboardComponent
     */
    public replaceVal: number = 0;

    /**
     * expiry days for replacement leave
     * @type {number}
     * @memberof DashboardComponent
     */
    public RLDaysToGo: number;

    /**
     * get birthday details from endpoint
     * @type {*}
     * @memberof DashboardComponent
     */
    public birthdayDetail: any;

    /**
     * long leave details
     * @type {*}
     * @memberof DashboardComponent
     */
    public longLeave: any;

    /**
     * task list
     * @type {*}
     * @memberof DashboardComponent
     */
    public tasks: any;

    /**
     * application status list from API
     * @type {*}
     * @memberof DashboardComponent
     */
    public applicationStatus: any;

    /**
     * expired replacement leave
     * @type {*}
     * @memberof DashboardComponent
     */
    public expiredRL: number = 0;

    /**
     * annual leave days to go
     * @type {number}
     * @memberof DashboardComponent
     */
    public annualDaysToGo: number;

    /**
     * get url of profile picture
     * @type {*}
     * @memberof DashboardComponent
     */
    public url: any;

    /**
     * expired date of RL
     * @type {*}
     * @memberof DashboardComponent
     */
    public expiredDate: any;

    /**
     * reason value get from confirmation pop up
     * @private
     * @type {string}
     * @memberof DashboardComponent
     */
    private _reason: string;

    /**
     * set menu is open or close by assign new class
     * @type {boolean}
     * @memberof DashboardComponent
     */
    @HostBinding('class.menuOverlay') menuOpen: boolean = false;

    /**
     *Creates an instance of DashboardComponent.
     * @param {DashboardApiService} dashboardAPI
     * @param {MenuController} menu
     * @param {MatDialog} dialog
     * @memberof DashboardComponent
     */
    constructor(private dashboardAPI: DashboardApiService, private menu: MenuController, private router: Router) {
        router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.dashboardAPI.apiService.get_profile_pic('all').subscribe(data => {
                    this.url = data;
                })
                this.get_RL();
                this.getAnnouncementList();
                this.getHolidayList();
                this.get_annual_medical_task();
            });

    }

    /**
     * Initial method
     * @memberof DashboardComponent
     */
    ngOnInit() {
        this.dashboardAPI.get_birthday_details().subscribe(data => {
            this.birthdayDetail = data;
            this.row = true;
            this.showSpinner = false;
        });
        this.getHolidayList();
        this.getAnnouncementList();
        this.get_annual_medical_task();
        this.get_RL();
        this.dashboardAPI.get_long_leave_reminder().subscribe(details => {
            this.longLeave = details;
            this.showSpinner = false;
        });
    }

    /**
     * open dialog of status application
     * @memberof DashboardComponent
     */
    openStatusDialog(item: any) {
        const dialog = this.dashboardAPI.dialog.open(LeaveApplicationConfirmationComponent, {
            data: { title: 'application', leavetype: item.leaveTypeName, transactionId: item.leaveTransactionId, appliedDate: item.dateApplied, reason: item.reason, status: item.status, startDate: item.startDate, endDate: item.endDate, noOfDays: item.noOfDays, timeslot: item.timeSlot },
            height: "440px",
            width: "440px",
            panelClass: 'custom-dialog-container'
        });
        dialog.afterClosed().subscribe(result => {
            if (result != undefined) {
                this._reason = result[1];
                this.postLeaveApplicationStatus(result[2], result[0]);
                this.dashboardAPI.popUpDialog("You've cancelled your leave application request", true);
            }
        });
    }

    /**
     * open dialog of my task
     * @memberof DashboardComponent
     */
    async openTaskDialog(list: any) {
        const dialog = this.dashboardAPI.dialog.open(LeaveApplicationConfirmationComponent, {
            data: { title: 'task', name: list.employeeName, leavetype: list.leaveTypeName, transactionId: list.leaveTransactionId, appliedDate: list.dateApplied, reason: list.reason, status: list.status, startDate: list.startDate, endDate: list.endDate, noOfDays: list.noOfDays, timeslot: list.timeSlot },
            height: "450px",
            width: "440px",
            panelClass: 'custom-dialog-container'
        });
        let value = await dialog.afterClosed().toPromise();
        if (value !== undefined) {
            console.log(value);
            this._reason = value[1];
            await this.postLeaveApplicationStatus(value[2], value[0]);
            this.dashboardAPI.popUpDialog("Your tasks has been submitted successfully", true);
        };
    }

    /**
     * remaining days to reach birthday
     * @param {*} data
     * @memberof DashboardComponent
     */
    calculateDays(data: any) {
        let month = new Date(data).getMonth();
        let day = new Date(data).getDate();
        let myBirthday = [day, month]; // 6th of February
        let today = new Date();
        let bday = new Date(today.getFullYear(), myBirthday[1], myBirthday[0] + 1);
        if (today.getTime() > bday.getTime()) {
            bday.setFullYear(bday.getFullYear() + 1);
        }
        let diff = bday.getTime() - today.getTime();
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return days;
    }

    /**
     * get annual & medical details from endpoint
     * @memberof DashboardComponent
     */
    get_annual_medical_task() {
        this.dashboardAPI.get_annual_leave().subscribe(details => {
            this.annualVal = details;
            this.showSpinner = false;
            this.annualDaysToGo = this.calculateDays(this.annualVal.YEAR);
            this.dashboardAPI.get_user_application_status(this.annualVal.USER_GUID).subscribe(val => {
                this.applicationStatus = val;
            })
        })
        this.dashboardAPI.get_medical_leave().subscribe(details => {
            this.showSpinner = false;
            if (details.status == undefined) {
                this.medicalVal = details.BALANCE_DAYS;
            }
        })
        this.get_task_list();
    }

    /**
     * get pending task list
     * @memberof DashboardComponent
     */
    get_task_list() {
        this.dashboardAPI.get_task_list().subscribe(data => {
            this.tasks = data;
            if (this.tasks.status == undefined) {
                this.tasks.sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
            }
        });
    }


    /**
     * get value from replacement leave endpoint
     * @memberof DashboardComponent
     */
    get_RL() {
        this.dashboardAPI.get_detailed_RL().subscribe(details => {
            const RL = details;
            this.showSpinner = false;
            let date = [];
            if (RL.status == undefined) {
                this.replaceVal = RL.balance;
                for (let i = 0; i < RL.active.length; i++) {
                    // this.replaceVal += RL.active[i].DAYS_ADDED;
                    date.push(RL.active[i].EXPIREDATE);
                }
                for (let i = 0; i < RL.expired.length; i++) {
                    this.expiredRL += RL.expired[i].DAYS_ADDED;
                }
                if (date.every((val, i, arr) => val === arr[0])) {
                    this.RLDaysToGo = this.calculateDays(date[0]);
                    this.expiredDate = date[0];
                }
            }
        })
    }

    /**
     * get holiday list from endpoint
     * @memberof DashboardComponent
     */
    getHolidayList() {
        this.dashboardAPI.get_upcoming_holidays().subscribe(details => {
            this.holidays = details;
            this.showSpinner = false;
            for (let i = 0; i < this.holidays.length; i++) {
                this.holidays[i].day = this.getDayFromDate(new Date(this.holidays[i].start));
                this.holidays[i].start = (moment(this.holidays[i].start).format('DD MMM YYYY'));
            }
        })
    }

    /**
     * get all announcement list
     * @memberof DashboardComponent
     */
    getAnnouncementList() {
        this.dashboardAPI.get_announcement_list().subscribe(list => {
            this.announcements = list;
            this.showSpinner = false;
        })
    }

    /**
     * get day of the search Date
     * @param {Date} date
     * @returns
     * @memberof DashboardComponent
     */
    getDayFromDate(date: Date) {
        const weekdays = new Array(
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        );
        const day = date.getDay();
        return weekdays[day];
    }

    /**
     * method to approve clicked leave transaction GUID
     * @param {string} leaveGUID
     * @memberof DashboardComponent
     */
    postLeaveApplicationStatus(leaveGUID: string, status: string) {
        this.dashboardAPI.post_application_status({ "id": leaveGUID, "reason": this._reason }, status).subscribe(response => {
            this.get_task_list();
            this.get_annual_medical_task();
        }, error => this.dashboardAPI.popUpDialog(JSON.parse(error._body).status, false))
    }

}