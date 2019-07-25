export interface Holidays {

    /**
     * Local property of Day for date in calendar
     * @type {string}
     * @memberof Holidays
     */
    day: string;
    /**
     * Local property of start date in calendar
     * @type {string}
     * @memberof Holidays
     */
    start: string;

    /**
     * Local property of end date in calendar
     * @type {string}
     * @memberof Holidays
     */
    end: string;

    /**
     * Local property of title name in calendar
     * @type {string}
     * @memberof Holidays
     */
    title: string;
}

import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listYear from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { APIService } from 'src/services/shared-service/api.service';
import * as _moment from 'moment';
import { LeavePlanningAPIService } from '../leave-planning-api.service';
const moment = _moment;

/**
 * Calendar View Page
 * @export
 * @class CalendarViewPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-calendar-view',
    templateUrl: './calendar-view.page.html',
    styleUrls: ['./calendar-view.page.scss'],
})
export class CalendarViewPage implements OnInit {

    /**
     * This is local property for Full Calendar Component
     * @type {FullCalendarComponent}
     * @memberof CalendarViewPage
     */
    @ViewChild('calendar') calendar: FullCalendarComponent;

    /**
     * This is input property for plugins of Full Calendar Component
     * @memberof CalendarViewPage
     */
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, listYear];

    /**
     * Get data from user profile API
     * @type {*}
     * @memberof CalendarViewPage
     */
    public list: any;

    /**
     * Get calendar id from user profile API & request data from calendar API
     * @type {string}
     * @memberof CalendarViewPage
     */
    public calendarId: string;

    /** 
     * Property for alias Event Input of Full Calendar Component
     * @type {EventInput[]}
     * @memberof CalendarViewPage
     */
    public events: EventInput[];

    /**
     *Creates an instance of CalendarViewPage.
     * @param {APIService} apiService
     * @param {LeavePlanningAPIService} leaveAPI
     * @memberof CalendarViewPage
     */
    constructor(private apiService: APIService, private leaveAPI: LeavePlanningAPIService) { }

    ngOnInit() {
        this.apiService.get_user_profile().subscribe(
            (data: any[]) => {
                this.list = data;
                this.calendarId = this.list.calendarId;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            },
            () => {
                this.leaveAPI.get_personal_holiday_calendar(this.calendarId).subscribe(
                    data => {
                        this.editDateFormat(data.holiday);
                    }
                );
            }
        );
    }

    /**
     * format date using moment library
     * @param {*} date
     * @memberof CalendarViewPage
     */
    editDateFormat(date) {
        this.events = date;
        for (let i = 0; i < date.length; i++) {
            this.events[i].start = (moment(date[i].start).format('YYYY-MM-DD'));
            this.events[i].end = moment(date[i].end).format('YYYY-MM-DD');
            this.events[i].day = this.getWeekDay(new Date(date[i].start));
            this.events[i].allDay = true;
        }
        setTimeout(() => {
            let calendarView = this.calendar.getApi();
            calendarView.render();
        }, 100);
    }

    /**
     * Method to get day of the week from a given date
     * @param {*} date
     * @returns
     * @memberof CalendarViewPage
     */
    getWeekDay(date) {
        //Create an array containing each day, starting with Sunday.
        const weekdays = new Array(
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        );
        //Use the getDay() method to get the day.
        const day = date.getDay();
        //Return the element that corresponds to that index.
        return weekdays[day];
    }



}
