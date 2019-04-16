export enum DayType {
    'Full Day',
    'Half Day',
    'Quarter Day'
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { ActivatedRoute } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import * as _moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
const moment = _moment;

@Component({
    selector: 'app-apply-leave',
    templateUrl: './apply-leave.page.html',
    styleUrls: ['./apply-leave.page.scss'],
})
export class ApplyLeavePage implements OnInit {

    private _userList: any;
    private _leaveTypeName: string;
    public entitlement: any;
    public dateArray: any;
    public leaveTypeId: string;
    public daysAvailable: string = '';
    public daysCount: number = 0;
    public fullDay: boolean = true;
    public showAddIcon: boolean = true;
    public halfDayOptionSelected: boolean;
    public disabledHalfDayDate: boolean = true;
    public timeSlot: string;
    public halfDaydates: string;
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
    public calendarEvents: EventInput[] = [
        { title: 'Wesak Day', start: new Date('05-12-2019'), end: new Date('05-16-2019'), allDay: true }
    ];
    public minDate: string;
    public maxDate: string;
    private reformatDateFrom: string;
    private reformatDateTo: string;
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    get dayTypes(): FormArray {
        return this.applyLeaveForm.get('dayTypes') as FormArray;
    }

    applyLeaveForm = new FormGroup({
        dayTypes: new FormArray([
            new FormControl('0'),
        ]),
        leaveTypes: new FormControl('', Validators.required),
        firstPicker: new FormControl('', Validators.required),
        secondPicker: new FormControl('', Validators.required),
        inputReason: new FormControl('', Validators.required),
    });

    constructor(private apiService: APIService,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.applyLeaveForm.patchValue({
                    leaveTypes: params.type,
                });
                this.daysAvailable = params.balance;
                this.leaveTypeId = params.id;
                console.log(params, this.applyLeaveForm);
            });


        this.apiService.get_user_profile().subscribe(
            (data: any[]) => {
                this._userList = data;
                this.entitlement = this._userList.entitlementDetail;
                console.log('entitlement', this.entitlement);
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
        setTimeout(() => {
            let calendarApi = this.calendarComponent.getApi();
            calendarApi.render();
        }, 100);
    }

    select(event) {
        this.applyLeaveForm.patchValue({
            firstPicker: event.start,
            secondPicker: new Date((event.end).setDate((event.end).getDate() - 1))
        });
        this.reformatDateFrom = moment(this.applyLeaveForm.value.firstPicker).format('YYYY-MM-DD HH:mm:ss');
        this.reformatDateTo = moment(this.applyLeaveForm.value.secondPicker).format('YYYY-MM-DD HH:mm:ss');
        this.dateArray = this.getDateArray(this.reformatDateFrom, this.reformatDateTo);
        this.daysCount = this.dateArray.length;
    }

    postData() {
        const applyLeaveData = {
            "leaveTypeID": this.leaveTypeId,
            "startDate": this.reformatDateFrom,
            "endDate": this.reformatDateTo,
            "dayType": Number(this.dayTypes.value[0]),
            "halfDay": this.timeSlot,
            "reason": this.applyLeaveForm.value.inputReason
        }
        console.log(applyLeaveData);

        this.apiService.post_user_apply_leave(applyLeaveData).subscribe(
            (val) => {
                console.log("PATCH call successful value returned in body", val);
            },
            response => {
                console.log("PATCH call in error", response);
            });
        this.setEvent(this._leaveTypeName, this.applyLeaveForm.value.firstPicker, new Date((this.applyLeaveForm.value.secondPicker).setDate((this.applyLeaveForm.value.secondPicker).getDate() + 1)));

    }

    onDateChange(): void {
        if (!this.applyLeaveForm.value.firstPicker || !this.applyLeaveForm.value.secondPicker) {
        } else {
            this.reformatDateFrom = moment(this.applyLeaveForm.value.firstPicker).format('YYYY-MM-DD HH:mm:ss');
            this.reformatDateTo = moment(this.applyLeaveForm.value.secondPicker).format('YYYY-MM-DD HH:mm:ss');
            this.dateArray = this.getDateArray(this.reformatDateFrom, this.reformatDateTo);
            this.daysCount = this.dateArray.length;
        }
    }

    // get event from server that postData()
    setEvent(name: string, sdt, edt) {
        if (name && sdt && edt) {
            this.calendarEvents = this.calendarEvents.concat({
                title: name,
                start: sdt,
                end: edt,
                allDay: true
            })
        }
    }
    getValueFrom(event: MatDatepickerInputEvent<string>): string {
        return this.minDate = moment(event.value).format('YYYY-MM-DD');
    }
    getValueTo(event: MatDatepickerInputEvent<string>): string {
        const toDate: string = moment(event.value).subtract(1, 'days').format('YYYY-MM-DD');
        if (toDate < this.minDate) {
            return this.maxDate = this.minDate;
        } else {
            return this.maxDate = toDate;
        }
    }

    getDateArray(start, end) {
        var arr = new Array();
        var startDate = new Date(start);
        var endDate = new Date(end);
        while (startDate <= endDate) {
            arr.push(new Date(startDate));
            startDate.setDate(startDate.getDate() + 1);
        }
        return arr;
    }


    dayTypesChanged(event) {
        this.showAddIcon = true;
        if (event.value === "0") {
            this.fullDay = true;
        } else if (event.value === "1") {
            this.fullDay = false;
            this.halfDayOptionSelected = true;
            this.disabledHalfDayDate = false;
        } else {
            this.fullDay = false;
        }
    }
    halfDaySelectionChanged(date, i) {
        console.log('half Day selected1', date);
    }

    timeSlotChanged(event, i) {
        console.log('timeslot selected:', event.value, i);
        this.timeSlot = event.value;
    }

    addFormField() {
        if (this.dayTypes.controls.length < Object.keys(DayType).length / 2) {
            this.dayTypes.push(new FormControl());
            console.log(this.dayTypes);
        } else {
            this.showAddIcon = false;
            alert("No other option");
        }
    }

    handleDateClick(arg) {
        // if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
        // this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
        //     title: 'New Event',
        //     start: arg.date,
        //     allDay: arg.allDay
        // })
        // }
    }

    getIndex(leave) {
        this.daysAvailable = leave.balanceDays;
        this.leaveTypeId = leave.leaveTypeId;
        this._leaveTypeName = leave.leaveTypeName;
    }



    // halfDaySelected(event) {
    //     if (event.detail.checked === true) {
    //         this.halfDayOptionSelected = true;
    //         this.disabledHalfDayDate = false;
    //     } else {
    //         this.halfDayOptionSelected = false;
    //         this.disabledHalfDayDate = true;
    //         this.halfDaydates = undefined;
    //         this.timeSlot = '';
    //     }
    // }



}
