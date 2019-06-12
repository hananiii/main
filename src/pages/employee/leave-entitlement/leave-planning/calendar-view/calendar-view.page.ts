export interface Holidays {
    start: string;
    end: string;
    title: string;
}

import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listYear from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
    selector: 'app-calendar-view',
    templateUrl: './calendar-view.page.html',
    styleUrls: ['./calendar-view.page.scss'],
})
export class CalendarViewPage implements OnInit {

    @ViewChild('calendar') calendar: FullCalendarComponent;
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, listYear];
    private _days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // var d = new Date(dateString);
    // var dayName = days[d.getDay()];

    // get from server
    public calendarEvents: EventInput[] = [
        { title: 'Wesak Day', start: new Date('05-12-2019'), end: new Date('05-16-2019'), allDay: true },
        { title: 'Wesak Day', start: new Date('04-13-2019'), allDay: true },
        { title: 'Perak Sultan Birthday', start: new Date('05-15-2019'), allDay: true },
    ];
    // get from server
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

    constructor(
    ) {
    }

    ngOnInit() {
        setTimeout(() => {
            let calendarView = this.calendar.getApi();
            calendarView.render();
        }, 100);
    }

}
