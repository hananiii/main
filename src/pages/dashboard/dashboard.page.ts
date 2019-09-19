export enum Category {
    "new-announcement", // sms
    "new-user-join", // account-box
    "user-leave", // sms
    "user-update", // account-box
    "user-birthday" // cake
}

import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DashboardAPIService } from './dashboard-api.service';
import * as _moment from 'moment';
import { MenuController } from '@ionic/angular';
const moment = _moment;

/**
 * Dashboard Page
 * @export
 * @class DashboardPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    providers: [DatePipe]
})
export class DashboardPage implements OnInit {
    /**
     * This is local property of button outline style 
     * @type {string}
     * @memberof DashboardPage
     */
    // public buttonOneFill: string = 'outline';

    /**
     * This is local property of button outline style
     * @type {string}
     * @memberof DashboardPage
     */
    // public buttonTwoFill: string = 'clear';

    /**
     * This is local property of button outline style
     * @type {string}
     * @memberof DashboardPage
     */
    // public buttonThreeFill: string = 'clear';

    /**
     * This is local property of show all updates content
     * @type {boolean}
     * @memberof DashboardPage
     */
    // public showAllUpdates: boolean = true;

    /**
     * This is local property of show my recent content
     * @type {boolean}
     * @memberof DashboardPage
     */
    // public showMyRecent: boolean = false;

    /**
     * This is local property of show announcement content
     * @type {boolean}
     * @memberof DashboardPage
     */
    // public showAnnouncement: boolean = false;

    /**
     * This is local property of show icon of red dot
     * @type {boolean}
     * @memberof DashboardPage
     */
    // public showDot: boolean = true;

    /**
     * This is local property to expand content
     * @type {boolean}
     * @memberof DashboardPage
     */
    // public showViewMore: boolean = true;

    /**
     * This is local property to collapse content
     * @type {boolean}
     * @memberof DashboardPage
     */
    // public showViewLess: boolean = false;

    /**
     * This is local property to expand who is onleave content
     * @type {boolean}
     * @memberof DashboardPage
     */
    // public seeAll: boolean = true;

    /**
     * This is local property to collapse who is onleave content
     * @type {boolean}
     * @memberof DashboardPage
     */
    // public seeLess: boolean = false;

    /**
     * This is local property to determine click on expand view more or vice versa
     * @type {boolean}
     * @memberof DashboardPage
     */
    // public clickOnViewMore: boolean;

    /**
     * This is local property to determine click on expand see all or vice versa
     * @type {boolean}
     * @memberof DashboardPage
     */
    // public clickOnSeeAll: boolean;

    /**
     * Get on leave total employee number & employee onleave number from API
     * @type {*}
     * @memberof DashboardPage
     */
    public onLeaveNumber: any;

    /**
     * Get on leave employee name & designation from API
     * @type {*}
     * @memberof DashboardPage
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
     * @memberof DashboardPage
     */
    public row: boolean = false;

    /**
     * Notification update from API
     * @type {*}
     * @memberof DashboardPage
     */
    public notification: any;

    /**
     * upcoming holiday list
     * @type {*}
     * @memberof DashboardPage
     */
    public holidays: any;

    /**
     * announcements list
     * @type {*}
     * @memberof DashboardPage
     */
    public announcements: any;

    /**
     * show all holiday 
     * @type {boolean}
     * @memberof DashboardPage
     */
    public showall: boolean = false;

    /**
     * show holiday view less button
     * @type {boolean}
     * @memberof DashboardPage
     */
    public showViewLessButton: boolean = false;

    /**
     * Return enum category
     * @readonly
     * @type {*}
     * @memberof DashboardPage
     */
    get enumCategory(): any {
        return Category;
    }

    /**
     *Creates an instance of DashboardPage.
     * @param {DashboardAPIService} dashboardAPI
     * @param {DatePipe} datePipe
     * @param {MenuController} menu
     * @memberof DashboardPage
     */
    constructor(private dashboardAPI: DashboardAPIService, private datePipe: DatePipe, private menu: MenuController) { }

    /**
     * Initial method
     * @memberof DashboardPage
     */
    ngOnInit() {
        this.getOnleaveDetails();
        this.dashboardAPI.get_news_notification().subscribe(data => {
            this.notificationCategory(data);
        }, error => {
            if (error) {
                window.location.href = '/login';
            }
        });
        this.getHolidayList();
        this.getAnnouncementList();
    }

    /**
     * get holiday list from endpoint
     * @memberof DashboardPage
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
     * @memberof DashboardPage
     */
    getAnnouncementList() {
        this.dashboardAPI.get_announcement_list().subscribe(list => {
            this.announcements = list;
            for (let i = 0; i < this.holidays.length; i++) {
                this.announcements[i].FROM_DATE = (moment(this.announcements[i].FROM_DATE).format('DD MMM YYYY'));
            }
        })
    }

    /**
     * get day of the search Date
     * @param {Date} date
     * @returns
     * @memberof DashboardPage
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
     * @memberof DashboardPage
     */
    getOnleaveDetails() {
        const params = { 'startdate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'), 'enddate': this.datePipe.transform(new Date(), 'yyyy-MM-dd') };
        this.dashboardAPI.get_status_onleave(params).subscribe(
            data => {
                this.onLeaveNumber = data;
            })
        this.dashboardAPI.get_onleave_list(params).subscribe(
            data => {
                this.row = true;
                this.showSpinner = false;
                this.onLeaveList = data;
            })
    }

    /**
     * Show material-icon according category of notification
     * @param {*} data
     * @memberof DashboardPage
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
     * toggle announcement menu
     * @memberof DashboardPage
     */
    viewAnnouncement() {
        this.menu.enable(true, 'viewAnnouncementDetails');
        this.menu.enable(false, 'viewHolidayDetails');
        this.menu.open('viewAnnouncementDetails');
    }

    /**
     * toggle holiday menu
     * @memberof DashboardPage
     */
    viewHoliday() {
        this.menu.enable(true, 'viewHolidayDetails');
        this.menu.enable(false, 'viewAnnouncementDetails');
        this.menu.open('viewHolidayDetails');
    }

    /**
     * This method is used to determine the button click and button style
     * @param {number} value
     * @memberof DashboardPage
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