export enum Category {
    "new-announcement", // sms
    "new-user-join", // account-box
    "user-leave", // sms
    "user-update", // account-box
    "user-birthday" // cake
}

import { Component, OnInit } from '@angular/core';
import { DashboardApiService } from './dashboard-api.service';
import * as _moment from 'moment';
import { MenuController } from '@ionic/angular';
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
     * This is local property of button outline style 
     * @type {string}
     * @memberof DashboardComponent
     */
    // public buttonOneFill: string = 'outline';

    /**
     * This is local property of button outline style
     * @type {string}
     * @memberof DashboardComponent
     */
    // public buttonTwoFill: string = 'clear';

    /**
     * This is local property of button outline style
     * @type {string}
     * @memberof DashboardComponent
     */
    // public buttonThreeFill: string = 'clear';

    /**
     * This is local property of show all updates content
     * @type {boolean}
     * @memberof DashboardComponent
     */
    // public showAllUpdates: boolean = true;

    /**
     * This is local property of show my recent content
     * @type {boolean}
     * @memberof DashboardComponent
     */
    // public showMyRecent: boolean = false;

    /**
     * This is local property of show announcement content
     * @type {boolean}
     * @memberof DashboardComponent
     */
    // public showAnnouncement: boolean = false;

    /**
     * This is local property of show icon of red dot
     * @type {boolean}
     * @memberof DashboardComponent
     */
    // public showDot: boolean = true;

    /**
     * This is local property to expand content
     * @type {boolean}
     * @memberof DashboardComponent
     */
    // public showViewMore: boolean = true;

    /**
     * This is local property to collapse content
     * @type {boolean}
     * @memberof DashboardComponent
     */
    // public showViewLess: boolean = false;

    /**
     * This is local property to expand who is onleave content
     * @type {boolean}
     * @memberof DashboardComponent
     */
    // public seeAll: boolean = true;

    /**
     * This is local property to collapse who is onleave content
     * @type {boolean}
     * @memberof DashboardComponent
     */
    // public seeLess: boolean = false;

    /**
     * This is local property to determine click on expand view more or vice versa
     * @type {boolean}
     * @memberof DashboardComponent
     */
    // public clickOnViewMore: boolean;

    /**
     * This is local property to determine click on expand see all or vice versa
     * @type {boolean}
     * @memberof DashboardComponent
     */
    // public clickOnSeeAll: boolean;

    /**
     * Get on leave total employee number & employee onleave number from API
     * @type {*}
     * @memberof DashboardComponent
     */
    public onLeaveNumber: any;

    /**
     * Get on leave employee name & designation from API
     * @type {*}
     * @memberof DashboardComponent
     */
    public onLeaveList: any;

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
     * Notification update from API
     * @type {*}
     * @memberof DashboardComponent
     */
    public notification: any;

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
     * entitlement list from endpoint
     * @type {*}
     * @memberof DashboardComponent
     */
    public entitlementList: any;

    /** 
     * annual leave details
     * @type {number}
     * @memberof DashboardComponent
     */
    public annualVal: number;

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
     * date of birth from personal details
     * @type {*}
     * @memberof DashboardComponent
     */
    public dateOfBirth: any;

    /**
     * days remaining to next birthday
     * @type {number}
     * @memberof DashboardComponent
     */
    public birtdayToGo: number;

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
     * Return enum category
     * @readonly
     * @type {*}
     * @memberof DashboardComponent
     */
    get enumCategory(): any {
        return Category;
    }

    /**
     *Creates an instance of DashboardComponent.
     * @param {DashboardApiService} dashboardAPI
     * @param {MenuController} menu
     * @memberof DashboardComponent
     */
    constructor(private dashboardAPI: DashboardApiService, private menu: MenuController) { }

    /**
     * Initial method
     * @memberof DashboardComponent
     */
    ngOnInit() {
        // this.getOnleaveDetails();
        this.dashboardAPI.get_birthday_details().subscribe(data => {
            this.birthdayDetail = data;
            this.row = true;
            this.showSpinner = false;
        });
        // this.dashboardAPI.get_news_notification().subscribe(data => {
        //     this.notificationCategory(data);
        //     this.row = true;
        //     this.showSpinner = false;
        // }, error => {
        //     if (error) {
        //         window.location.href = '/login';
        //     }
        // });
        this.getHolidayList();
        this.getAnnouncementList();
        // this.getUserDetails();
        this.get_annual_medical_task();
        this.dashboardAPI.get_long_leave_reminder().subscribe(details => this.longLeave = details)
        this.get_RL();
    }

    /**
     * get user profile details
     * @memberof DashboardComponent
     */
    // getUserDetails() {
    //     this.mainAPI.get_user_profile().subscribe(data => {
    //         this.entitlementList = data.entitlementDetail;
    //         this.dateOfBirth = moment(data.personalDetail.dob).format('DD MMM')
    //         this.birtdayToGo = this.calculateDays(data.personalDetail.dob);
    //         for (let i = 0; i < this.entitlementList.length; i++) {
    //             if (this.entitlementList[i].leaveTypeName == 'Annual Leave') {
    //                 this.annualVal = this.entitlementList[i].entitledDays;
    //             }
    //             if (this.entitlementList[i].leaveTypeName == 'Medical Leave') {
    //                 this.medicalVal = this.entitlementList[i].entitledDays;
    //             }
    //         }
    //     });
    // }

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
        })
        this.dashboardAPI.get_medical_leave().subscribe(details => {
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
    async get_task_list() {
        let data = await this.dashboardAPI.get_task_list().toPromise();
        this.tasks = data;
    }


    /**
     * get value from replacement leave endpoint
     * @memberof DashboardComponent
     */
    get_RL() {
        this.dashboardAPI.get_replacement_leave().subscribe(details => {
            const RL = details;
            let date = [];
            if (RL.status == undefined) {
                for (let i = 0; i < RL.length; i++) {
                    this.replaceVal += RL[i].DAYS_ADDED;
                    date.push(RL[i].EXPIREDATE);
                }
                if (date.every((val, i, arr) => val === arr[0])) {
                    this.RLDaysToGo = this.calculateDays(date[0]);
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
            for (let i = 0; i < this.announcements.length; i++) {
                this.announcements[i].FROM_DATE = (moment(this.announcements[i].FROM_DATE).format('DD MMM YYYY'));
            }
            const data = this.announcements;
            const is_pinned = 1;
            data.sort(function (x, y) { return x.IS_PINNED == is_pinned ? -1 : y == is_pinned ? 1 : 0; });
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
     * Get today onleave status(number of employee onleave, total employee) & onleave list from API
     * @memberof DashboardComponent
     */
    // getOnleaveDetails() {
    //     const params = { 'startdate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'), 'enddate': this.datePipe.transform(new Date(), 'yyyy-MM-dd') };
    //     this.dashboardAPI.get_status_onleave(params).subscribe(
    //         data => {
    //             this.onLeaveNumber = data;
    //         })
    //     this.dashboardAPI.get_onleave_list(params).subscribe(
    //         data => {
    //             this.row = true;
    //             this.showSpinner = false;
    //             this.onLeaveList = data;
    //         })
    // }

    /**
     * Show material-icon according category of notification
     * @param {*} data
     * @memberof DashboardComponent
     */
    notificationCategory(data: any) {
        this.notification = data;
        for (let i = 0; i < this.notification.length; i++) {
            // if (this.notification[i].CATEGORY === Category[0]) {
            this.notification[i].CREATION_TS = (moment(this.notification[i].CREATION_TS).format('DD MMM YYYY'));
            // }
            // if (this.notification[i].CATEGORY === Category[0] || this.notification[i].CATEGORY === Category[2]) {
            //     this.notification[i].icon = 'sms';
            // }
            // else if (this.notification[i].CATEGORY === Category[1] || this.notification[i].CATEGORY === Category[3]) {
            //     this.notification[i].icon = 'account_box';
            // }
            // else if (this.notification[i].CATEGORY === Category[4]) {
            //     this.notification[i].icon = 'cake';
            // }
            // else {
            //     this.notification[i].icon = 'account_box';
            // }
        }
    }

    /**
     * method to approve clicked leave transaction GUID
     * @param {string} leaveGUID
     * @memberof DashboardComponent
     */
    approveLeave(leaveGUID: string) {
        this.dashboardAPI.post_approve_list({ "id": leaveGUID }).subscribe(response => {
            this.get_task_list();
        })
    }

    /**
     * method to reject clicked leave transaction GUID
     * @param {*} leave_transaction_guid
     * @memberof DashboardComponent
     */
    rejectLeave(leave_transaction_guid) {
        this.dashboardAPI.post_reject_list({ "id": leave_transaction_guid }).subscribe(response => {
            this.get_task_list();
        })
    }

    /**
     * This method is used to determine the button click and button style
     * @param {number} value
     * @memberof DashboardComponent
     */
    // buttonClick(value: number) {
    //     if (value === 1) {
    //         this.buttonOneFill = 'outline';
    //         this.buttonTwoFill = 'clear';
    //         this.buttonThreeFill = 'clear';
    //         this.showAllUpdates = true;
    //         this.showMyRecent = false;
    //         this.showAnnouncement = false;
    //     } else if (value === 2) {
    //         this.buttonOneFill = 'clear';
    //         this.buttonTwoFill = 'outline';
    //         this.buttonThreeFill = 'clear';
    //         this.showAllUpdates = false;
    //         this.showMyRecent = true;
    //         this.showAnnouncement = false;
    //     } else {
    //         this.buttonOneFill = 'clear';
    //         this.buttonTwoFill = 'clear';
    //         this.buttonThreeFill = 'outline';
    //         this.showAllUpdates = false;
    //         this.showMyRecent = false;
    //         this.showAnnouncement = true;
    //         this.showDot = false;
    //     }
    // }

}