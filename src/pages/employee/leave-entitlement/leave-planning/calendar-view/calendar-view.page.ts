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
     * public holiday list
     * @type {*}
     * @memberof CalendarViewPage
     */
    public PBList: any;

    /**
     * get end date
     * @type {string}
     * @memberof CalendarViewPage
     */
    public endDate: string;

    /**
     * get full or half day
     * @type {string}
     * @memberof CalendarViewPage
     */
    public timeslot: string;

    /**
     * show text in clicked calendar
     * @type {string}
     * @memberof CalendarViewPage
     */
    public text: string;

    /**
     *Creates an instance of CalendarViewPage.
     * @param {APIService} apiService
     * @param {LeavePlanningAPIService} leaveAPI
     * @memberof CalendarViewPage
     */
    constructor(private apiService: APIService, private leaveAPI: LeavePlanningAPIService) { }

    async ngOnInit() {
        const date = new Date();
        let year = date.getFullYear();
        let a = await this.apiService.get_user_profile().toPromise();
        this.list = a;
        this.calendarId = this.list.calendarId;
        let holidayList = await this.leaveAPI.get_personal_holiday_calendar(this.calendarId, year).toPromise();
        this.PBList = holidayList.holiday;
        let onLeaveList = await this.leaveAPI.get_calendar_onleave_list({ 'startdate ': '2019-01-01', 'enddate': '2019-12-31' }).toPromise();
        this.events = this.PBList.concat(onLeaveList);
        this.editDateFormat(this.PBList);
        this.getEmployeeLeaveList(this.events);
    }

    /**
     * format date using moment library
     * @param {*} date
     * @memberof CalendarViewPage
     */
    editDateFormat(date: any) {
        for (let i = 0; i < date.length; i++) {
            this.PBList[i].str = (moment(date[i].start).format('DD-MM-YYYY'));
            this.PBList[i].day = this.getWeekDay(new Date(date[i].start));
            this.PBList[i]["backgroundColor"] = "#7069d8";
            this.PBList[i]["borderColor"] = "#7069d8";
        }
    }


    /**
     * display onleave & public holiday event in calendar
     * @param {*} list
     * @memberof CalendarViewPage
     */
    getEmployeeLeaveList(list: any) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].CODE != undefined) {
                this.events[i].start = moment(list[i].START_DATE).format('YYYY-MM-DD');
                this.events[i].end = moment(list[i].END_DATE).add(1, "days").format("YYYY-MM-DD");
                this.events[i].title = list[i].FULLNAME + ' ' + '(' + (list[i].CODE) + ')';
                // this.events[i].allDay = true;
                this.checkAllDay(list, i);
            } else {
                this.events[i].start = (moment(list[i].start).format('YYYY-MM-DD'));
                this.events[i].end = moment(list[i].end).format('YYYY-MM-DD');
                this.events[i].allDay = true;
            }
        }
        setTimeout(() => {
            let calendarView = this.calendar.getApi();
            calendarView.render();
        }, 100);
    }

    /**
     * check either is all day or half day
     * @param {*} list
     * @param {number} index
     * @memberof CalendarViewPage
     */
    checkAllDay(list: any, index: number) {
        if (list[index].TIME_SLOT) {
            this.events[index].allDay = false;
        } else {
            this.events[index].allDay = true;
        }
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

    /**
     * when event is clicked
     * show 'All Day' || 'Half Day'
     * @param {*} clicked
     * @memberof CalendarViewPage
     */
    onEventClick(clicked: any) {
        if (clicked.event.end) {
            this.endDate = moment(clicked.event.end).subtract(1, "days").format("YYYY-MM-DD");
        }
        if (clicked.event._def.extendedProps.TIME_SLOT) {
            this.timeslot = 'Half Day' + '(' + clicked.event._def.extendedProps.TIME_SLOT + ')';
        }
        if (clicked.event._def.extendedProps.TIME_SLOT == null) {
            this.timeslot = 'All Day';
        }
    }


}
