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
    // start: string;

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
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { APIService } from 'src/services/shared-service/api.service';
import * as _moment from 'moment';
import { LeavePlanningAPIService } from '../leave-planning-api.service';
const moment = _moment;

/**
 * Calendar View Page
 * @export
 * @class CalendarViewComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-calendar-view',
    templateUrl: './calendar-view.component.html',
    styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent implements OnInit {

    /**
     * This is local property for Full Calendar Component
     * @type {FullCalendarComponent}
     * @memberof CalendarViewComponent
     */
    @ViewChild('calendar') calendar: FullCalendarComponent;

    /**
     * This is input property for plugins of Full Calendar Component
     * @memberof CalendarViewComponent
     */
    public calendarPlugins = [dayGridPlugin, interactionPlugin];

    /**
     * Get data from user profile API
     * @type {*}
     * @memberof CalendarViewComponent
     */
    public list: any;

    /**
     * Get calendar id from user profile API & request data from calendar API
     * @type {string}
     * @memberof CalendarViewComponent
     */
    public calendarId: string;

    /** 
     * Property for alias Event Input of Full Calendar Component
     * @type {EventInput[]}
     * @memberof CalendarViewComponent
     */
    public events: EventInput[];

    /**
     * public holiday list
     * @type {*}
     * @memberof CalendarViewComponent
     */
    public PBList: any;

    /**
     * get end date
     * @type {string}
     * @memberof CalendarViewComponent
     */
    public endDate: string;

    /**
     * get full or half day
     * @type {string}
     * @memberof CalendarViewComponent
     */
    public timeslot: string;

    /**
     * show text in clicked calendar
     * @type {string}
     * @memberof CalendarViewComponent
     */
    // public text: string;

    public calendarList: any;

    public value: boolean = false;

    /**
     *Creates an instance of CalendarViewComponent.
     * @param {APIService} apiService
     * @param {LeavePlanningAPIService} leaveAPI
     * @memberof CalendarViewComponent
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
        this.calendarList = await this.leaveAPI.get_calendar_onleave_list({ 'enddate': moment(date).format('YYYY-MM-DD'), 'startdate': moment(date).format('YYYY-MM-DD') }).toPromise();
        this.events = this.PBList.concat(this.calendarList);
        console.log(this.PBList, this.events);
        this.editDateFormat(this.PBList);
        this.getEmployeeLeaveList(this.events);
    }

    abc(event) {
        console.log(event)
    }

    selectDate(event) {
        console.log(event);
        if (event.end != event.start) {
            // this.calendar.unselect();
            this.value = true
        }
    }

    aaaa(event) {
        console.log(event)
    }

    /**
     * format date using moment library
     * @param {*} date
     * @memberof CalendarViewComponent
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
     * @memberof CalendarViewComponent
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
     * @memberof CalendarViewComponent
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
     * @memberof CalendarViewComponent
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
     * @memberof CalendarViewComponent
     */
    // onEventClick(clicked: any) {
    //     if (clicked.event.end) {
    //         this.endDate = moment(clicked.event.end).subtract(1, "days").format("YYYY-MM-DD");
    //     }
    //     if (clicked.event._def.extendedProps.TIME_SLOT) {
    //         this.timeslot = 'Half Day' + '(' + clicked.event._def.extendedProps.TIME_SLOT + ')';
    //     }
    //     if (clicked.event._def.extendedProps.TIME_SLOT == null) {
    //         this.timeslot = 'All Day';
    //     }
    // }


}
