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
import { DayType } from './apply-leave.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { LeavePlanningAPIService } from '../leave-planning-api.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/employee/date.adapter';
import { ApplyLeaveConfirmationComponent } from './apply-leave-confirmation/apply-leave-confirmation.component';
const moment = _moment;
/**
 * Apply Leave Page
 * @export
 * @class ApplyLeaveComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-apply-leave',
    templateUrl: './apply-leave.component.html',
    styleUrls: ['./apply-leave.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class ApplyLeaveComponent implements OnInit {
    /**
     * Local property for leave entitlement details
     * @type {*}
     * @memberof ApplyLeaveComponent
     */
    public entitlement: any;

    /**
     * Get calendar id from user profile API & request data from calendar API
     * @type {string}
     * @memberof CalendarViewPage
     */
    public calendarId: string;

    /**
     * Local property for leave day available
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    public daysAvailable: number = 0;

    /**
     * Local property for leave day applied
     * @type {number}
     * @memberof ApplyLeaveComponent
     */
    public daysCount: number = 0;

    /**
     * Local property for show or hide Add icon
     * @type {boolean}
     * @memberof ApplyLeaveComponent
     */
    // public showAddIcon: boolean = true;

    /**
     * This is input property for plugins of Full Calendar Component
     * @memberof ApplyLeaveComponent
     */
    // public calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];

    /**
     * Property for alias Event Input of Full Calendar Component
     * @type {EventInput[]}
     * @memberof ApplyLeaveComponent
     */
    // public calendarEvents: EventInput[];

    /**
     * Local property for min. date range
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    public minDate: string;

    /**
     * Local property for max. date range
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    public maxDate: string;

    /**
     * Local property for leave form group
     * @type {FormGroup}
     * @memberof ApplyLeaveComponent
     */
    public applyLeaveForm: any;

    /**
     * Local property for selected quarter hour value
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    // public selectedQuarterHour: string = '';

    /**
     * Local property for leave type ID
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    public leaveTypeId: string;

    /**
     * show text in clicked calendar
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    // public text: string;

    /**
     * date in clicked calendar
     * @type {Date}
     * @memberof ApplyLeaveComponent
     */
    // public date: Date;

    /**
     * real number of day between start & end date
     * @type {number}
     * @memberof ApplyLeaveComponent
     */
    // public dateRealCount: number;

    /**
    * date range selected
    * @type {*}
    * @memberof ApplyLeaveComponent
    */
    public dateSelection: any;

    /**
     * am/pm button value
     * @type {boolean[]}
     * @memberof ApplyLeaveComponent
     */
    public amButton: boolean[] = [];

    /**
     * Q1 button clicked or not
     * @type {boolean}
     * @memberof ApplyLeaveComponent
     */
    public Q1Button: boolean[] = [];

    /**
     * Q2 button clicked or not
     * @type {boolean[]}
     * @memberof ApplyLeaveComponent
     */
    public Q2Button: boolean[] = [];

    /**
     * Q3 button clicked or not
     * @type {boolean[]}
     * @memberof ApplyLeaveComponent
     */
    public Q3Button: boolean[] = [];

    /**
     * Q4 button clicked or not
     * @type {boolean[]}
     * @memberof ApplyLeaveComponent
     */
    public Q4Button: boolean[] = [];

    /**
     * day name value of each set
     * '0' = full day
     * '1' = half day
     * '2' = quarter day
     * @type {string[]}
     * @memberof ApplyLeaveComponent
     */
    public dayName: string[] = [];

    /**
     * half day value (am/pm)
     * @private
     * @type {*}
     * @memberof ApplyLeaveComponent
     */
    private _slot: any = [];

    /**
     * index of half day in dayName array
     * @type {number[]}
     * @memberof ApplyLeaveComponent
     */
    public halfDayIndex: number[] = [];

    /**
     * index of quarter day in dayName array
     * @type {number[]}
     * @memberof ApplyLeaveComponent
     */
    public quarterDayIndex: number[] = [];

    /**
     * selected leave type name
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    public leaveCode: string;

    /**
     * Local private property for value get from API
     * @private
     * @type {*}
     * @memberof ApplyLeaveComponent
     */
    private _userList: any;

    /**
     * Local private property to get number of day from a week
     * eg: sunday-saturday is 0-6
     * @private
     * @type {number}
     * @memberof ApplyLeaveComponent
     */
    private _weekDayNumber: number[] = [];
    /**
     * Local private property for selected date array list
     * @private
     * @type {*}
     * @memberof ApplyLeaveComponent
     */
    private _dateArray: any;

    /**
     * Local private property for start date
     * @private
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    private _reformatDateFrom: string;

    /**
     * Local private property for end date
     * @private
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    private _reformatDateTo: string;

    /**
     * Default index number for first day types selection
     * @private
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    // private _index: string = '0';

    /**
     * Date selected for 1st day types selection 
     * @private
     * @memberof ApplyLeaveComponent
     */
    private _firstForm = [];

    /**
     * Date selected for 2nd day types selection 
     * @private
     * @memberof ApplyLeaveComponent
     */
    // private _secondForm = [];

    /**
     * Index number of selected date from selection list (_dateArray) for 1st day types selection
     * @private
     * @memberof ApplyLeaveComponent
     */
    // private _firstFormIndex = [];

    /**
     * Index number of selected date from selection list (_dateArray) for 2nd day types selection
     * @private
     * @memberof ApplyLeaveComponent
     */
    // private _secondFormIndex = [];

    /**
     * Disable date option list (true/false)
     * @private
     * @memberof ApplyLeaveComponent
     */
    // private _arrayList = [];

    /**
     * AM/PM for 1st day types selection
     * @private
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    // private _slot1: string;

    /**
     * AM/PM for 2nd day types selection
     * @private
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    // private _slot2: string;

    /**
     * {startDate: "YYYY-MM-DD 00:00:00", endDate: "YYYY-MM-DD 00:00:00", dayType: number, slot: string, quarterDay: string}
     * Object for 1st day types selection
     * @private
     * @memberof ApplyLeaveComponent
     */
    // private _objSlot1 = [];

    /**
     * Object for 2nd day types selection
     * @private
     * @memberof ApplyLeaveComponent
     */
    // private _objSlot2 = [];

    /**
     * Data collected from (_objSlot1, _objSlot2) POST to apply leave API
     * @private
     * @memberof ApplyLeaveComponent
     */
    private _arrayDateSlot = [];

    /**
     * Local property for selected quarter hour value
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    private _selectedQuarterHour: string[] = [];

    /**
     * This is local property for Full Calendar Component
     * @type {FullCalendarComponent}
     * @memberof ApplyLeaveComponent
     */
    // @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    /**
     * get return value of dayTypes array list
     * @readonly
     * @type {FormArray}
     * @memberof ApplyLeaveComponent
     */
    // get dayTypes(): FormArray {
    //     return this.applyLeaveForm.get('dayTypes') as FormArray;
    // }

    /**
     * Creates an instance of ApplyLeaveComponent.
     * @param {APIService} apiService
     * @param {ActivatedRoute} route
     * @param {LeavePlanningAPIService} leaveAPI
     * @memberof ApplyLeaveComponent
     */
    constructor(private apiService: APIService, private route: ActivatedRoute, private leaveAPI: LeavePlanningAPIService) {
        this.applyLeaveForm = new FormGroup({
            leaveTypes: new FormControl('', Validators.required),
            firstPicker: new FormControl('', Validators.required),
            secondPicker: new FormControl('', Validators.required),
            inputReason: new FormControl('', Validators.required),
        });
        route.queryParams
            .subscribe(params => {
                this.applyLeaveForm.patchValue({
                    leaveTypes: params.type,
                });
                this.daysAvailable = params.balance;
                this.leaveTypeId = params.id;
            });
    }

    /**
     * Initial method
     * Get user profile list from API
     * @memberof ApplyLeaveComponent
     */
    async ngOnInit() {
        const dt = new Date();
        const yr = dt.getFullYear();
        let data = await this.apiService.get_user_profile().toPromise();
        this._userList = data;
        this.calendarId = this._userList.calendarId;
        this.leaveAPI.get_personal_holiday_calendar(this.calendarId, yr).subscribe(
            data => {
                // this.formatDate(data.holiday);
                for (let i = 0; i < data.rest.length; i++) {
                    const weekdays = new Array(
                        "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"
                    );
                    this._weekDayNumber.push(weekdays.indexOf(data.rest[i].fullname));
                }
            }
        );
        this.leaveAPI.get_entilement_details().subscribe(list => {
            this.entitlement = list;
        })
        // setTimeout(() => {
        //     let calendarApi = this.calendarComponent.getApi();
        //     calendarApi.render();
        // }, 100);
    }

    /**
     * This method is used to form group for validation
     * @returns
     * @memberof ApplyLeaveComponent
     */
    // formGroup() {
    //     return new FormGroup({
    //         // dayTypes: new FormArray([
    //         //     new FormGroup({
    //         //         name: new FormControl(0),
    //         //         selectArray: new FormArray([
    //         //             new FormControl(['0']),
    //         //             new FormControl(''),
    //         //         ]),
    //         //         status: new FormControl([false])
    //         //     })
    //         // ]),
    //         leaveTypes: new FormControl('', Validators.required),
    //         firstPicker: new FormControl('', Validators.required),
    //         secondPicker: new FormControl('', Validators.required),
    //         inputReason: new FormControl('', Validators.required),
    //     });
    // }

    /**
     * format date using moment library
     * @param {*} holiday
     * @memberof CalendarViewPage
     */
    // formatDate(holiday) {
    //     this.calendarEvents = holiday;
    //     for (let i = 0; i < holiday.length; i++) {
    //         this.calendarEvents[i].start = (moment(holiday[i].start).format('YYYY-MM-DD'));
    //         this.calendarEvents[i].end = moment(holiday[i].end).format('YYYY-MM-DD');
    //         this.calendarEvents[i].day = this.getDayName(new Date(holiday[i].start));
    //         this.calendarEvents[i].allDay = true;
    //         this.calendarEvents[i]["backgroundColor"] = "#7069d8";
    //         this.calendarEvents[i]["borderColor"] = "#7069d8";
    //     }
    // }

    /**
     * Method to get day of the week from a given date
     * @param {*} date
     * @returns
     * @memberof CalendarViewPage
     */
    getDayName(date) {
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
     * This method is used to create consecutive date as an array list
     * @param {*} arrayValue
     * @returns
     * @memberof ApplyLeaveComponent
     */
    createConsecutiveDate(arrayValue) {
        let arr = arrayValue,
            i = 0,
            result = arr.reduce(function (stack, b) {
                var cur = stack[i],
                    a = cur ? cur[cur.length - 1] : 0;
                if (b - a > 86400000) {
                    i++;
                }
                if (!stack[i])
                    stack[i] = [];
                stack[i].push(b);
                return stack;
            }, []);
        return result;
    }

    /**
     * This method is used to post data to apply leave API 
     * @memberof ApplyLeaveComponent
     */
    postData() {
        let newArray = [];
        newArray = this._dateArray;
        newArray = newArray.filter(val => !this._firstForm.includes(val));
        let result = this.createConsecutiveDate(newArray);
        for (let i = 0; i < result.length; i++) {
            if (result[i] !== undefined) {
                const minMax = this.getMinMaxDate(result[i]);
                const remainingFullDay = {
                    "startDate": moment(minMax[0]).format('YYYY-MM-DD HH:mm:ss'),
                    "endDate": moment(minMax[1]).format('YYYY-MM-DD HH:mm:ss'),
                    "dayType": 0,
                    "slot": "",
                    "quarterDay": ""
                }
                this._arrayDateSlot.push(remainingFullDay);
            }
        }
        this.postDataHalfQuarter();
        const applyLeaveData = {
            "leaveTypeID": this.leaveTypeId,
            "reason": this.applyLeaveForm.value.inputReason,
            "data": this._arrayDateSlot
        }
        console.log(applyLeaveData);

        const dialog = this.apiService.matdialog.open(ApplyLeaveConfirmationComponent, {
            data: { leavetype: this.leaveCode, reason: this.applyLeaveForm.value.inputReason, details: this._arrayDateSlot },
            height: "300px",
            width: "440px"
        });
        dialog.afterClosed().subscribe(result => {
            if (result === 'OK') {
                this.leaveAPI.post_user_apply_leave(applyLeaveData).subscribe(
                    (val) => {
                        console.log("PATCH call successful value returned in body", val);
                        this.clearArrayList();
                        this.applyLeaveForm.reset();
                        this.daysAvailable = 0;
                        this.daysCount = 0;
                        this.minDate = '';
                        this.maxDate = '';
                        if (val.valid === true) {
                            this.leaveAPI.openSnackBar(val.message, true);
                        } else {
                            this.leaveAPI.openSnackBar(val.message, false);
                        }
                    },
                    response => {
                        console.log("PATCH call in error", response);
                        this.clearArrayList();
                        this.leaveAPI.openSnackBar(response.message, false);
                    });
            }
        });
    }

    /**
     * This method is used to clear all form value
     * @memberof ApplyLeaveComponent
     */
    clearArrayList() {
        // this._arrayList = [];
        this._firstForm = [];
        // this._secondForm = [];
        // this._firstFormIndex = [];
        // this._secondFormIndex = [];
        // this._objSlot1 = [];
        // this._objSlot2 = [];
        this._arrayDateSlot = [];
        // this.selectedQuarterHour = '';
        this._dateArray = [];
        this._slot = [];
        this._selectedQuarterHour = [];
        this.quarterDayIndex = [];
        this.halfDayIndex = [];
        this.dayName = [];
        this.dateSelection = [];

    }

    /**
     * get quarter and half day slot value 
     * eg: AM, PM, Q1 to Q4
     * @memberof ApplyLeaveComponent
     */
    postDataHalfQuarter() {
        this.dayName.forEach((dayVal, index) => {
            dayVal === '1' ? this.halfDayIndex.push(index) : null;
            dayVal === '2' ? this.quarterDayIndex.push(index) : null;
        });

        for (let i = 0; i < this.halfDayIndex.length; i++) {
            const remainingFullDay = {
                "startDate": _moment(this._dateArray[this.halfDayIndex[i]]).format('YYYY-MM-DD HH:mm:ss'),
                "endDate": _moment(this._dateArray[this.halfDayIndex[i]]).format('YYYY-MM-DD HH:mm:ss'),
                "dayType": 1,
                "slot": this._slot[this.halfDayIndex[i]],
                "quarterDay": ""
            }
            this._arrayDateSlot.push(remainingFullDay);
        }

        for (let i = 0; i < this.quarterDayIndex.length; i++) {
            const remainingFullDay = {
                "startDate": _moment(this._dateArray[this.quarterDayIndex[i]]).format('YYYY-MM-DD HH:mm:ss'),
                "endDate": _moment(this._dateArray[this.quarterDayIndex[i]]).format('YYYY-MM-DD HH:mm:ss'),
                "dayType": 2,
                "slot": "",
                "quarterDay": this._selectedQuarterHour[this.quarterDayIndex[i]]
            }
            this._arrayDateSlot.push(remainingFullDay);
        }
        console.log(this._arrayDateSlot);
    }

    /**
     * This method is used to patch value of selected start date & end date
     * Calculate weekdays
     * @memberof ApplyLeaveComponent
     */
    onDateChange(): void {
        if (!this.applyLeaveForm.value.firstPicker || !this.applyLeaveForm.value.secondPicker) {
        } else {
            this._reformatDateFrom = moment(this.applyLeaveForm.value.firstPicker).format('YYYY-MM-DD HH:mm:ss');
            this._reformatDateTo = moment(this.applyLeaveForm.value.secondPicker).format('YYYY-MM-DD HH:mm:ss');
            this.getWeekDays(this.applyLeaveForm.value.firstPicker, this.applyLeaveForm.value.secondPicker, this._weekDayNumber);
            this.dateSelection = this._dateArray;
            this.dayName = [];
            this._slot = []; this._selectedQuarterHour = []; this._firstForm = [];
            for (let i = 0; i < this.dateSelection.length; i++) {
                this.dateSelection[i] = _moment(this.dateSelection[i]).format('DD MMMM YYYY');
                this.dayName.push("0");
                this.amButton.push(true);
                this.Q1Button.push(true);
                this.Q2Button.push(false);
                this.Q3Button.push(false);
                this.Q4Button.push(false);
            }

            // this.dayTypes.patchValue([{ selectArray: [this._dateArray] }]);
            // this.dayTypes.controls.splice(1, 1);
            // this.clearArrayList(false);
            // if (this._dateArray.length === 1) {
            //     this.showAddIcon = false;
            // } else { this.showAddIcon = true; }
        }
    }

    /**
     * day name change
     * @param {*} event
     * @param {number} j
     * @memberof ApplyLeaveComponent
     */
    dayNameChanged(event: any, j: number) {
        if (this.dayName[j] == '1' && event.value == '0') {
            this.daysCount += 0.5;
        }
        if (this.dayName[j] == '2' && event.value == '0') {
            this.daysCount += 0.75;
        }
        if (this.dayName[j] == '2' && event.value == '1') {
            this.daysCount += 0.25;
        }
        if (this.dayName[j] == '0' && event.value == '1') {
            this.daysCount -= 0.50;
        }
        if (this.dayName[j] == '1' && event.value == '2') {
            this.daysCount -= 0.25;
        }
        if (this.dayName[j] == '0' && event.value == '2') {
            this.daysCount -= 0.75;
        }
        this.dayName.splice(j, 1, event.value);
        if (event.value == '1') {
            this._slot[j] = "AM";
            if (this._firstForm.indexOf(this._dateArray[j]) < 0) {
                this._firstForm.push(this._dateArray[j]);
            }
        }
        if (event.value === '2') {
            this._selectedQuarterHour[j] = "Q1";
            if (!(this._firstForm.includes(this._dateArray[j]))) {
                this._firstForm.push(this._dateArray[j]);
            }
        }
        if (event.value == '0') {
            const index = this._firstForm.indexOf(this._dateArray[j]);
            this._firstForm.splice(index, 1);
        }
    }

    /**
     * get am/pm or quarter value(Q1 to Q4)
     * @param {number} j
     * @param {string} buttonVal
     * @memberof ApplyLeaveComponent
     */
    getHalfQuarterValue(j: number, buttonVal: string) {
        if (buttonVal == 'AM' || buttonVal == 'PM') {
            this._slot[j] = buttonVal;
        } else {
            this._selectedQuarterHour[j] = buttonVal;
        }
    }

    /**
     * This method is used to calculate weekdays
     * @param {Date} first
     * @param {Date} last
     * @returns
     * @memberof ApplyLeaveComponent
     */
    getWeekDays(first: Date, last: Date, dayNumber: number[]) {
        if (first > last) return -1;
        var start = new Date(first.getTime());
        var end = new Date(last.getTime());
        this.daysCount = 0;
        // this.dateRealCount = 0;
        this._dateArray = [];
        while (start <= end) {
            if (!dayNumber.includes(start.getDay())) {
                this.daysCount++;
                // this.dateRealCount++;
                this._dateArray.push(new Date(start));
            }
            start.setDate(start.getDate() + 1);
        }
        return [this.daysCount, this._dateArray];
    }

    /**
     * quarter day calculation
     * @param {*} event
     * @memberof ApplyLeaveComponent
     */
    // quarterDay(event: any) {
    //     if (this.selectedQuarterHour == '') {
    //         this.daysCount -= 0.75;
    //     }
    //     this.selectedQuarterHour = event.value;
    // }

    /**
     * This method is used to get min. and max. date of each date array
     * @param {*} all_dates
     * @returns
     * @memberof ApplyLeaveComponent
     */
    getMinMaxDate(all_dates) {
        let max_dt = all_dates[0],
            max_dtObj = new Date(all_dates[0]);
        let min_dt = all_dates[0],
            min_dtObj = new Date(all_dates[0]);
        all_dates.forEach(function (dt, index) {
            if (new Date(dt) > max_dtObj) {
                max_dt = dt;
                max_dtObj = new Date(dt);
            }
            if (new Date(dt) < min_dtObj) {
                min_dt = dt;
                min_dtObj = new Date(dt);
            }
        });
        return [min_dt, max_dt];
    }

    /**
     * This method is used to set min. date of datepicker start date
     * @param {MatDatepickerInputEvent<string>} event
     * @returns {string}
     * @memberof ApplyLeaveComponent
     */
    getValueFrom(event: MatDatepickerInputEvent<string>): string {
        return this.minDate = moment(event.value).format('YYYY-MM-DD');
    }

    /**
     * This method is used to set max. date of datepicker end date
     * @param {MatDatepickerInputEvent<string>} event
     * @returns {string}
     * @memberof ApplyLeaveComponent
     */
    getValueTo(event: MatDatepickerInputEvent<string>): string {
        const toDate: string = moment(event.value).format('YYYY-MM-DD');
        if (toDate < this.minDate) {
            return this.maxDate = this.minDate;
        } else {
            return this.maxDate = toDate;
        }
    }

    /**
     * This method is used to detect selection change of day types
     * @param {*} event
     * @param {*} index
     * @memberof ApplyLeaveComponent
     */
    // dayTypesChanged(event: any, index: any) {
    //     this._index = index;
    //     this.showAddIcon = true;
    //     if (event.value == '1') {
    //         this.open(index);
    //         if (this.selectedQuarterHour != '') {
    //             this.daysCount += 0.75;
    //             this.selectedQuarterHour = '';
    //         }
    //         if (this.dateRealCount === 1) {
    //             this.showAddIcon = false;
    //         }
    //     }
    //     if (event.value == '2') {
    //         this.showAddIcon = false;
    //         if (this.dateRealCount === 1 && this.daysCount !== 1) {
    //             this._objSlot1 = [];
    //             this._slot1 = '';
    //             this.halfDaySelectionChanged([], 0);
    //             // this.open(0);
    //             // this._firstFormIndex = [];
    //         }
    //     }
    // }

    /**
     * This method is used to patch value to form control status
     * @param {number} i
     * @param {*} value
     * @param {boolean} disabled
     * @memberof ApplyLeaveComponent
     */
    // patchValueFunction(i: number, value: any, disabled: boolean) {
    //     for (let j = 0; j < value.length; j++) {
    //         const valueFirst = (this.dayTypes.controls[i].value.status[0]).splice(value[j], 1, disabled);
    //         this.dayTypes.controls[0].patchValue([{ status: valueFirst }]);
    //     }
    // }

    /**
     * This method is used to detect opened change of half day dates
     * @param {number} index
     * @memberof ApplyLeaveComponent
     */
    // open(index: number) {
    //     if (this._arrayList.length === 0) {
    //         for (let j = 0; j < this.dayTypes.controls[index].value.selectArray[0].length; j++) {
    //             this._arrayList.push(false);
    //         }
    //     }
    //     const selected = (this.dayTypes.controls[index].value.status).splice(0, 1, this._arrayList);
    //     this.dayTypes.controls[index].patchValue([{ status: selected }]);
    //     if (index == 0) {
    //         this.patchValueFunction(index, this._firstFormIndex, false);
    //         this.patchValueFunction(index, this._secondFormIndex, true);
    //     } if (index == 1) {
    //         this.patchValueFunction(index, this._firstFormIndex, true);
    //         this.patchValueFunction(index, this._secondFormIndex, false);
    //     }
    // }

    /**
     * This method is used to calculate days of leave apply
     * @param {*} date
     * @param {*} form
     * @memberof ApplyLeaveComponent
     */
    // calculate(date: any, form: any) {
    //     let missing = null;
    //     for (let i = 0; i < form.length; i++) {
    //         if (date.indexOf(form[i]) == -1) {
    //             missing = form[i];
    //             this.daysCount = this.daysCount + 0.5;
    //         }
    //     }
    //     if (!missing) {
    //         this.daysCount = this.daysCount - 0.5;
    //     }
    // }

    /**
     * This method is used to check duplicate start date
     * @param {*} obj
     * @param {*} list
     * @returns
     * @memberof ApplyLeaveComponent
     */
    // containsObject(obj: any, list: any) {
    //     for (let i = 0; i < list.length; i++) {
    //         if (list[i].startDate === obj.startDate) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    /**
     * This method is used to format body to be send to POST API
     * @param {*} form
     * @param {*} array
     * @param {string} slot
     * @memberof ApplyLeaveComponent
     */
    // postValueReformat(form: any, array: any, slot: string) {
    //     for (let j = 0; j < form.length; j++) {
    //         const obj = {
    //             "startDate": moment(form[j]).format('YYYY-MM-DD HH:mm:ss'),
    //             "endDate": moment(form[j]).format('YYYY-MM-DD HH:mm:ss'),
    //             "dayType": Number(this.dayTypes.controls[this._index].value.name),
    //             "slot": slot,
    //             "quarterDay": this.selectedQuarterHour,
    //         }
    //         if (this.containsObject(obj, array) === false) {
    //             array.push(obj);
    //         }
    //         if (obj.slot !== array[j].slot) {
    //             array.splice(j, 1, obj);
    //         }
    //     }
    // }

    /**
     * This method is used to calculate days when selected date options
     * @param {*} selectedDate
     * @param {number} index
     * @memberof ApplyLeaveComponent
     */
    // halfDaySelectionChanged(selectedDate: any, index: number) {
    //     if (index == 0) {
    //         this.calculate(selectedDate, this._firstForm);
    //         this._firstForm = selectedDate;
    //         this.postValueReformat(this._firstForm, this._objSlot1, this._slot1);
    //     }
    //     if (index == 1) {
    //         this.calculate(selectedDate, this._secondForm);
    //         this._secondForm = selectedDate;
    //         this.postValueReformat(this._secondForm, this._objSlot2, this._slot2);
    //     }
    //     this._arrayDateSlot = this._objSlot1.concat(this._objSlot2);
    // }

    /**
     * This method is used to assign value of selected date option
     * @param {number} i
     * @param {number} indexj
     * @memberof ApplyLeaveComponent
     */
    // valueSelected(i: number, indexj: number) {
    //     if (i == 0) {
    //         const index = this._firstFormIndex.findIndex(item => item === indexj);
    //         if (index > -1) {
    //             this._firstFormIndex.splice(index, 1);
    //         } else {
    //             this._firstFormIndex.push(indexj);
    //         }
    //     } if (i == 1) {
    //         const index = this._secondFormIndex.findIndex(item => item === indexj);
    //         if (index > -1) {
    //             this._secondFormIndex.splice(index, 1);
    //         } else {
    //             this._secondFormIndex.push(indexj);
    //         }
    //     }
    // }

    /**
     * This method is used to get time slot AM/PM when detect change
     * @param {*} event
     * @param {*} i
     * @memberof ApplyLeaveComponent
     */
    // timeSlotChanged(event: any, i: any) {
    //     this._index = i;
    //     const selected = (this.dayTypes.controls[this._index].value.selectArray).splice(1, 1, event.value);
    //     this.dayTypes.controls[i].patchValue([{ selectArray: selected }]);
    //     if (i === 0) {
    //         this._slot1 = event.value;
    //         this.postValueReformat(this._firstForm, this._objSlot1, this._slot1);
    //     }
    //     if (i === 1) {
    //         this._slot2 = event.value;
    //         this.postValueReformat(this._secondForm, this._objSlot2, this._slot2);
    //     }
    //     this._arrayDateSlot = this._objSlot1.concat(this._objSlot2);
    // }

    /**
     * This method is used for add new form group after clicked add button
     * @memberof ApplyLeaveComponent
     */
    // addFormField() {
    //     if (this.dayTypes.controls.length < 2) {
    //         this.dayTypes.push(new FormGroup({
    //             name: new FormControl(0),
    //             selectArray: new FormArray([new FormControl(this._dateArray), new FormControl('')]),
    //             status: new FormControl([false])
    //         }));
    //     } else {
    //         alert("No other option");
    //     }
    // }

    /**
     * click to remove day types form
     * @memberof ApplyLeaveComponent
     */
    // removeItem() {
    //     this._objSlot2 = [];
    //     this._slot2 = '';
    //     this.halfDaySelectionChanged([], 1);
    //     this.open(1);
    //     this._secondFormIndex = [];
    //     this.dayTypes.controls.splice(1, 1);
    // }


}
