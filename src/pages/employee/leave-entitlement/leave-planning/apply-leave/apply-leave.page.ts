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
import { Subscription } from 'rxjs';
import { DayType } from './apply-leave.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationPage } from './notification/notification.page';
const moment = _moment;

@Component({
    selector: 'app-apply-leave',
    templateUrl: './apply-leave.page.html',
    styleUrls: ['./apply-leave.page.scss'],
})
export class ApplyLeavePage implements OnInit {

    public entitlement: any;
    public daysAvailable: string = '';
    public daysCount: number = 0;
    public showAddIcon: boolean = true;
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
    public calendarEvents: EventInput[] = [
        // Get from server and display in calendar after login
        {
            title: 'Wesak Day', start: '2019-05-16T08:00:00', end: '2019-05-18'
            // allDay: true, description: '', color: 'yellow', textColor: 'white', backgroundColor: '#057dcd'
        }
    ]
    public minDate: string;
    public maxDate: string;
    public applyLeaveForm: FormGroup;
    public selectedQuarterHour: string = '';
    private _userList: any;
    private _leaveTypeName: string;
    private _dateArray: any;
    private _leaveTypeId: string;
    private reformatDateFrom: string;
    private reformatDateTo: string;
    private _index: string = '0';
    private _firstForm = [];
    private _secondForm = [];
    private _thirdForm = [];
    private _firstFormIndex = [];
    private _secondFormIndex = [];
    private _thirdFormIndex = [];
    private _arrayList = [];
    private _slot1: string; private _slot2: string; private _slot3: string;
    private _objSlot1 = [];
    private _objSlot2 = [];
    private _objSlot3 = [];
    private _arrayDateSlot = [];
    private subscription: Subscription = new Subscription();
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    get dayTypes(): FormArray {
        return this.applyLeaveForm.get('dayTypes') as FormArray;
    }

    constructor(private apiService: APIService,
        private route: ActivatedRoute, private snackBar: MatSnackBar) {
        this.applyLeaveForm = this.formGroup();
        route.queryParams
            .subscribe(params => {
                this.applyLeaveForm.patchValue({
                    leaveTypes: params.type,
                });
                this.daysAvailable = params.balance;
                this._leaveTypeId = params.id;
            });
    }

    ngOnInit() {

        this.subscription = this.apiService.get_user_profile().subscribe(
            (data: any[]) => {
                this._userList = data;
                this.entitlement = this._userList.entitlementDetail;
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

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    formGroup() {
        return new FormGroup({
            dayTypes: new FormArray([
                new FormGroup({
                    name: new FormControl('0'),
                    selectArray: new FormArray([
                        new FormControl(['0']),
                        new FormControl(''),
                    ]),
                    status: new FormControl([false])
                })
            ]),
            leaveTypes: new FormControl('', Validators.required),
            firstPicker: new FormControl('', Validators.required),
            secondPicker: new FormControl('', Validators.required),
            inputReason: new FormControl('', Validators.required),
        });
    }

    dayRender(ev) {
        ev.el.addEventListener('dblclick', () => {
            alert('double click!');
        });
    }

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

    postData() {
        let newArray = [];
        newArray = this._dateArray;
        newArray = newArray.filter(val => !this._firstForm.includes(val));
        newArray = newArray.filter(val => !this._secondForm.includes(val));
        newArray = newArray.filter(val => !this._thirdForm.includes(val));

        if (this.dayTypes.value[0].name !== '2') {
            let result = this.createConsecutiveDate(newArray);
            for (let i = 0; i < result.length; i++) {
                if (result[i] !== undefined) {
                    const minMax = this.getMinMaxDate(result[i]);
                    const remainingFullDay = {
                        "startDate": moment(minMax[0]).format('YYYY-MM-DD HH:mm:ss'),
                        "endDate": moment(minMax[1]).format('YYYY-MM-DD HH:mm:ss'),
                        "dayType": '0',
                        "slot": "",
                        "quarterDay": this.selectedQuarterHour
                    }
                    this._arrayDateSlot.push(remainingFullDay);
                }
            }
        }
        if (this.dayTypes.value[0].name == '2') {
            let result = this.createConsecutiveDate(newArray);
            for (let i = 0; i < result.length; i++) {
                if (result[i] !== undefined) {
                    const minMaxValue = this.getMinMaxDate(result[i]);
                    const remainingFullDay = {
                        "startDate": moment(minMaxValue[0]).format('YYYY-MM-DD HH:mm:ss'),
                        "endDate": moment(minMaxValue[1]).format('YYYY-MM-DD HH:mm:ss'),
                        "dayType": '2',
                        "slot": "",
                        "quarterDay": this.selectedQuarterHour
                    }
                    this._arrayDateSlot.push(remainingFullDay);
                }
            }
        }

        const applyLeaveData = {
            "leaveTypeID": this._leaveTypeId,
            "reason": this.applyLeaveForm.value.inputReason,
            "data": this._arrayDateSlot
        }
        console.log(applyLeaveData);

        this.subscription = this.apiService.post_user_apply_leave(applyLeaveData).subscribe(
            (val) => {
                console.log("PATCH call successful value returned in body", val);
                this.clearArrayList();
                this.openSnackBar('success');
            },
            response => {
                console.log("PATCH call in error", response);
                this.clearArrayList();
                this.openSnackBar('fail');
                if (response.status === 401) {
                    window.location.href = '/login';
                }
            });
        this.setEvent(this._leaveTypeName, this.applyLeaveForm.value.firstPicker, new Date((this.applyLeaveForm.value.secondPicker).setDate((this.applyLeaveForm.value.secondPicker).getDate() + 1)));
    }

    clearArrayList() {
        this.applyLeaveForm = this.formGroup();
        this._arrayList = [];
        this._firstForm = [];
        this._secondForm = [];
        this._thirdForm = [];
        this._firstFormIndex = [];
        this._secondFormIndex = [];
        this._thirdFormIndex = [];
        this._objSlot1 = [];
        this._objSlot2 = [];
        this._objSlot3 = [];
        this._arrayDateSlot = [];
        this.selectedQuarterHour = '';
    }

    onDateChange(): void {
        if (!this.applyLeaveForm.value.firstPicker || !this.applyLeaveForm.value.secondPicker) {
        } else {
            this.reformatDateFrom = moment(this.applyLeaveForm.value.firstPicker).format('YYYY-MM-DD HH:mm:ss');
            this.reformatDateTo = moment(this.applyLeaveForm.value.secondPicker).format('YYYY-MM-DD HH:mm:ss');
            this.getWeekDays(this.applyLeaveForm.value.firstPicker, this.applyLeaveForm.value.secondPicker);
            this.dayTypes.patchValue([{ selectArray: [this._dateArray] }]);
        }
    }

    // function to calculate weekdays
    getWeekDays(first: Date, last: Date) {
        if (first > last) return -1;
        var start = new Date(first.getTime());
        var end = new Date(last.getTime());
        this.daysCount = 0;
        this._dateArray = [];
        while (start <= end) {
            if (start.getDay() != 0 && start.getDay() != 6) {
                this.daysCount++;
                this._dateArray.push(new Date(start));
            }
            start.setDate(start.getDate() + 1);
        }
        return [this.daysCount, this._dateArray];
    }

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

    // get event from server that postData()
    setEvent(name: string, sdt: Date, edt: Date) {
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
        const toDate: string = moment(event.value).format('YYYY-MM-DD');
        if (toDate < this.minDate) {
            return this.maxDate = this.minDate;
        } else {
            return this.maxDate = toDate;
        }
    }

    dayTypesChanged(event: any, index: any) {
        this._index = index;
        this.showAddIcon = true;
        if (event.value == '1') {
            this.open(index);
        }
    }

    patchValueFunction(i: number, value: any, disabled: boolean) {
        for (let j = 0; j < value.length; j++) {
            const valueFirst = (this.dayTypes.controls[i].value.status[0]).splice(value[j], 1, disabled);
            this.dayTypes.controls[0].patchValue([{ status: valueFirst }]);
        }
    }

    open(index: number) {
        if (this._arrayList.length === 0) {
            for (let j = 0; j < this.dayTypes.controls[index].value.selectArray[0].length; j++) {
                this._arrayList.push(false);
            }
        }
        const selected = (this.dayTypes.controls[index].value.status).splice(0, 1, this._arrayList);
        this.dayTypes.controls[index].patchValue([{ status: selected }]);
        if (index == 0) {
            this.patchValueFunction(index, this._firstFormIndex, false);
            this.patchValueFunction(index, this._secondFormIndex, true);
            this.patchValueFunction(index, this._thirdFormIndex, true);
        } if (index == 1) {
            this.patchValueFunction(index, this._firstFormIndex, true);
            this.patchValueFunction(index, this._secondFormIndex, false);
            this.patchValueFunction(index, this._thirdFormIndex, true);
        } if (index == 2) {
            this.patchValueFunction(index, this._firstFormIndex, true);
            this.patchValueFunction(index, this._secondFormIndex, true);
            this.patchValueFunction(index, this._thirdFormIndex, false);
        }
    }

    calculate(date: any, form: any) {
        let missing = null;
        for (let i = 0; i < form.length; i++) {
            if (date.indexOf(form[i]) == -1) {
                missing = form[i];
                this.daysCount = this.daysCount + 0.5;
            }
        }
        if (!missing) { this.daysCount = this.daysCount - 0.5; }
    }

    containsObject(obj: any, list: any) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].startDate === obj.startDate) {
                return true;
            }
        }
        return false;
    }

    postValueReformat(form: any, array: any, slot: string) {
        for (let j = 0; j < form.length; j++) {
            const obj = {
                "startDate": moment(form[j]).format('YYYY-MM-DD HH:mm:ss'),
                "endDate": moment(form[j]).format('YYYY-MM-DD HH:mm:ss'),
                "dayType": this.dayTypes.controls[this._index].value.name,
                "slot": slot,
                "quarterDay": this.selectedQuarterHour,
            }
            if (this.containsObject(obj, array) === false) {
                array.push(obj);
            }
            if (obj.slot !== array[j].slot) {
                array.splice(j, 1, obj);
            }
        }
    }

    halfDaySelectionChanged(selectedDate: any, index: number) {
        if (index == 0) {
            this.calculate(selectedDate, this._firstForm);
            this._firstForm = selectedDate;
            this.postValueReformat(this._firstForm, this._objSlot1, this._slot1);
        }
        if (index == 1) {
            this.calculate(selectedDate, this._secondForm);
            this._secondForm = selectedDate;
            this.postValueReformat(this._secondForm, this._objSlot2, this._slot2);
        }
        if (index == 2) {
            this.calculate(selectedDate, this._thirdForm);
            this._thirdForm = selectedDate;
            this.postValueReformat(this._thirdForm, this._objSlot3, this._slot3);
        }
        this._arrayDateSlot = this._objSlot1.concat(this._objSlot2).concat(this._objSlot3);
    }

    valueSelected(i: number, indexj: number) {
        if (i == 0) {
            const index = this._firstFormIndex.findIndex(item => item === indexj);
            if (index > -1) {
                this._firstFormIndex.splice(index, 1);
            } else {
                this._firstFormIndex.push(indexj);
            }
        } if (i == 1) {
            const index = this._secondFormIndex.findIndex(item => item === indexj);
            if (index > -1) {
                this._secondFormIndex.splice(index, 1);
            } else {
                this._secondFormIndex.push(indexj);
            }
        } if (i == 2) {
            const index = this._thirdFormIndex.findIndex(item => item === indexj);
            if (index > -1) {
                this._thirdFormIndex.splice(index, 1);
            } else {
                this._thirdFormIndex.push(indexj);
            }
        }
    }

    timeSlotChanged(event: any, i: any) {
        this._index = i;
        const selected = (this.dayTypes.controls[this._index].value.selectArray).splice(1, 1, event.value);
        this.dayTypes.controls[i].patchValue([{ selectArray: selected }]);
        if (i === 0) {
            this._slot1 = event.value;
            this.postValueReformat(this._firstForm, this._objSlot1, this._slot1);
        }
        if (i === 1) {
            this._slot2 = event.value;
            this.postValueReformat(this._secondForm, this._objSlot2, this._slot2);
        }
        if (i === 2) {
            this._slot3 = event.value;
            this.postValueReformat(this._thirdForm, this._objSlot3, this._slot3);
        }
        this._arrayDateSlot = this._objSlot1.concat(this._objSlot2).concat(this._objSlot3);
    }

    addFormField() {
        if (this.dayTypes.controls.length < Object.keys(DayType).length / 2) {
            this.dayTypes.push(new FormGroup({
                name: new FormControl('0'),
                selectArray: new FormArray([new FormControl(this._dateArray), new FormControl('')]),
                status: new FormControl([false])
            }));
        } else {
            this.showAddIcon = false;
            alert("No other option");
        }
    }

    getIndex(leave: any) {
        this.daysAvailable = leave.balanceDays;
        this._leaveTypeId = leave.leaveTypeId;
        this._leaveTypeName = leave.leaveTypeName;
    }

    openSnackBar(message: string) {
        this.snackBar.openFromComponent(NotificationPage, {
            duration: 2000,
            data: message
        });
    }

}
