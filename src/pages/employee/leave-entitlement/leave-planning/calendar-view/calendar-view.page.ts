export interface Holidays {
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


    private _days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // var d = new Date(dateString);
    // var dayName = days[d.getDay()];

    /** 
     * Property for alias Event Input of Full Calendar Component
     * @type {EventInput[]}
     * @memberof CalendarViewPage
     */
    public calendarEvents: EventInput[] = [
        { title: 'Wesak Day', start: new Date('05-12-2019'), end: new Date('05-16-2019'), allDay: true },
        { title: 'Wesak Day', start: new Date('04-13-2019'), allDay: true },
        { title: 'Perak Sultan Birthday', start: new Date('05-15-2019'), allDay: true },
    ];

    /**
     * Local property for holiday list
     * @type {Holidays[]}
     * @memberof CalendarViewPage
     */
    public holidays: Holidays[] = [
        { 'start': '13-04-19', 'end': '13-04-19', 'title': 'Wesak Day' },
        { 'start': '14-04-19', 'end': '14-04-19', 'title': 'Perak Sultan Birthday' },
        { 'start': '15-05-19', 'end': '14-04-19', 'title': 'Raya' },
        { 'start': '14-06-19', 'end': '14-04-19', 'title': 'Raya' },
        { 'start': '13-07-19', 'end': '14-04-19', 'title': 'Agong Birthday' },
        { 'start': '17-07-19', 'end': '14-04-19', 'title': 'Selangor Sultan Birthday' },
        { 'start': '19-07-19', 'end': '13-04-19', 'title': 'Wesak Day' },
        { 'start': '31-08-19', 'end': '14-04-19', 'title': 'Merdeka' }
    ];

    /**
     *Creates an instance of CalendarViewPage.
     * @memberof CalendarViewPage
     */
    constructor(
    ) {
    }

    /**
     * Initial method
     * Render calendar
     * @memberof CalendarViewPage
     */
    ngOnInit() {
        setTimeout(() => {
            let calendarView = this.calendar.getApi();
            calendarView.render();
        }, 100);
    }

}
