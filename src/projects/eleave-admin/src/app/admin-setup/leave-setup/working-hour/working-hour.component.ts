import { OnInit, Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { WorkingHourApiService } from "./working-hour-api.service";
import { MenuController } from "@ionic/angular";
import * as _moment from 'moment';

/**
 * create or update working hour profile
 * @export
 * @class WorkingHourComponent
 * @implements {OnInit} 
 * @implements {OnChanges}
 */
@Component({
    selector: 'app-working-hour',
    templateUrl: './working-hour.component.html',
    styleUrls: ['./working-hour.component.scss'],
})
export class WorkingHourComponent implements OnInit, OnChanges {

    /**
     * form group use in validate value 
     * @type {*}
     * @memberof WorkingHourComponent
     */
    public workingHourForm: any;

    /**
     * show loading small spinner when clicked submit button
     * @type {boolean}
     * @memberof WorkingHourComponent
     */
    public showSmallSpinner: boolean = false;

    /**
     * show/hide toggle button in timepicker
     * @type {boolean}
     * @memberof WorkingHourComponent
     */
    public meridian: boolean = true;

    /**
     * show/hide arrow up & down in timepicker toggle button
     * @type {boolean}
     * @memberof WorkingHourComponent
     */
    public spinners: boolean = false;

    /**
     * details from requested id
     * @private
     * @type {*}
     * @memberof WorkingHourComponent
     */
    private _data: any;

    /**
     * get the full day start time in utc format
     * @private
     * @memberof WorkingHourComponent
     */
    private _startTime;

    /**
     * get the full day end time in utc format
     * @private
     * @memberof WorkingHourComponent
     */
    private _endTime;

    /** 
     * get value of clicked working_hour_guid from parent page
     * @type {string}
     * @memberof WorkingHourComponent
     */
    @Input() id: string;

    /**
     * get value of selecte profile is default value or not
     * @type {boolean}
     * @memberof WorkingHourComponent
     */
    @Input() isDefaultProfile: boolean;

    /**
     * emit value to hide this page after clicked back button
     * @memberof WorkingHourComponent
     */
    @Output() valueChange = new EventEmitter();

    /**
     * emit value of checkbox default working hour
     * @memberof WorkingHourComponent
     */
    @Output() defaultProfileValue?= new EventEmitter();


    /**
     *Creates an instance of WorkingHourComponent.
     * @param {WorkingHourApiService} workingHourAPI
     * @param {MenuController} menu
     * @memberof WorkingHourComponent
     */
    constructor(private workingHourAPI: WorkingHourApiService, private menu: MenuController) {
        this.workingHourForm = new FormGroup({
            profileName: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            startpicker: new FormControl('', Validators.required),
            endpicker: new FormControl('', Validators.required),
            starthalfdayAMpicker: new FormControl('', Validators.required),
            endhalfdayAMpicker: new FormControl('', Validators.required),
            starthalfdayPMpicker: new FormControl('', Validators.required),
            endhalfdayPMpicker: new FormControl('', Validators.required),
            startQ1picker: new FormControl('', Validators.required),
            endQ1picker: new FormControl('', Validators.required),
            startQ2picker: new FormControl('', Validators.required),
            endQ2picker: new FormControl('', Validators.required),
            startQ3picker: new FormControl('', Validators.required),
            endQ3picker: new FormControl('', Validators.required),
            startQ4picker: new FormControl('', Validators.required),
            endQ4picker: new FormControl('', Validators.required),
        })
    }

    /**
     * initial method to get working hour details
     * @memberof WorkingHourComponent
     */
    async ngOnInit() {
        let items = await this.workingHourAPI.get_working_hours_profile_list().toPromise();
        this._data = await this.workingHourAPI.get_working_hours_details(items[0].working_hours_guid).toPromise();
        // <ion-icon ios = "ios-star" md = "md-star" > </ion-icon>
    }

    /**
     * get selected working hour details 
     * @param {SimpleChanges} changes
     * @memberof WorkingHourComponent
     */
    async ngOnChanges(changes: SimpleChanges) {
        if (changes.id !== undefined) {
            if (changes.id.currentValue !== "" && changes.id.currentValue !== undefined) {
                let detail = await this.workingHourAPI.get_working_hours_details(this.id).toPromise();
                this.workingHourForm.patchValue({
                    profileName: detail.code,
                    description: detail.description,
                    startpicker: this.splitTime(detail.property.fullday.start_time),
                    endpicker: this.splitTime(detail.property.fullday.end_time),
                    starthalfdayAMpicker: this.splitTime(detail.property.halfday.AM.start_time),
                    endhalfdayAMpicker: this.splitTime(detail.property.halfday.AM.end_time),
                    starthalfdayPMpicker: this.splitTime(detail.property.halfday.PM.start_time),
                    endhalfdayPMpicker: this.splitTime(detail.property.halfday.PM.end_time),
                    startQ1picker: this.splitTime(detail.property.quarterday.Q1.start_time),
                    endQ1picker: this.splitTime(detail.property.quarterday.Q1.end_time),
                    startQ2picker: this.splitTime(detail.property.quarterday.Q2.start_time),
                    endQ2picker: this.splitTime(detail.property.quarterday.Q2.end_time),
                    startQ3picker: this.splitTime(detail.property.quarterday.Q3.start_time),
                    endQ3picker: this.splitTime(detail.property.quarterday.Q3.end_time),
                    startQ4picker: this.splitTime(detail.property.quarterday.Q4.start_time),
                    endQ4picker: this.splitTime(detail.property.quarterday.Q4.end_time)
                });
            }
            if (changes.id.currentValue == '') {
                this.workingHourForm.reset()
            }
        } if (changes.isDefaultProfile !== undefined) {
            if (changes.isDefaultProfile.currentValue !== "" && changes.isDefaultProfile.currentValue !== undefined) {
                this.isDefaultProfile = changes.isDefaultProfile.currentValue;
            }
        }
        // else { this.workingHourForm.reset() }
    }

    /**
     * split original time format
     * @param {*} time
     * @returns
     * @memberof WorkingHourComponent
     */
    splitTime(time) {
        return {
            "hour": Number((time.split(':'))[0]), "minute": Number((time.split(':'))[1])
        }
    }

    /**
     * full day on changed
     * @param {*} date
     * @param {string} name
     * @memberof WorkingHourComponent
     */
    onChange(date, name: string) {
        if (date !== null) {
            if (name == 'start') {
                let timeStart = this.timeReformat(date);
                this._startTime = _moment.utc(timeStart, "HH:mm");
            } else {
                let timeEnd = this.timeReformat(date);
                this._endTime = _moment.utc(timeEnd, "HH:mm");
            }
            this.calculateTime(this._startTime, this._endTime);
        }
    }

    /**
     * calculate time to fill up half day & quarter day time
     * @param {*} str
     * @param {*} end
     * @memberof WorkingHourComponent
     */
    calculateTime(str, end) {
        if ((str && end) != undefined) {
            const d = _moment.duration(end.diff(str));
            const s = _moment.utc(+d).format('H:mm');
            if (s == "9:00") {
                this.workingHourForm.patchValue(
                    {
                        starthalfdayAMpicker: this.splitTime(_moment(str).format("HH:mm")),
                        endhalfdayAMpicker: this.splitTime(_moment(str).add(4, 'hours').format("HH:mm")),
                        starthalfdayPMpicker: this.splitTime(_moment(end).subtract(4, 'hours').format("HH:mm")),
                        endhalfdayPMpicker: this.splitTime(_moment(end).format("HH:mm")),
                        startQ1picker: this.splitTime(_moment(str).format("HH:mm")),
                        endQ1picker: this.splitTime(_moment(str).add(2, 'hours').format("HH:mm")),
                        startQ2picker: this.splitTime(_moment(str).add(2, 'hours').format("HH:mm")),
                        endQ2picker: this.splitTime(_moment(str).add(4, 'hours').format("HH:mm")),
                        startQ3picker: this.splitTime(_moment(end).subtract(4, 'hours').format("HH:mm")),
                        endQ3picker: this.splitTime(_moment(end).subtract(2, 'hours').format("HH:mm")),
                        startQ4picker: this.splitTime(_moment(end).subtract(2, 'hours').format("HH:mm")),
                        endQ4picker: this.splitTime(_moment(end).format("HH:mm"))
                    });
            } else {
                this.workingHourForm.patchValue(
                    {
                        starthalfdayAMpicker: null,
                        endhalfdayAMpicker: null,
                        starthalfdayPMpicker: null,
                        endhalfdayPMpicker: null,
                        startQ1picker: null,
                        endQ1picker: null,
                        startQ2picker: null,
                        endQ2picker: null,
                        startQ3picker: null,
                        endQ3picker: null,
                        startQ4picker: null,
                        endQ4picker: null
                    });
            }
        }
    }

    /**
     * format time to default endpoint format
     * @param {*} value
     * @returns
     * @memberof WorkingHourComponent
     */
    timeReformat(value) {
        return value.hour + ":" + (value.minute < 10 ? '0' : '') + value.minute
    }

    /**
     * get data before send to endpoint
     * @memberof WorkingHourComponent
     */
    postWorkingHourSetup() {
        this.showSmallSpinner = true;
        this._data.code = this.workingHourForm.controls.profileName.value;
        this._data.description = this.workingHourForm.controls.description.value;
        this._data.property.fullday.start_time = this.timeReformat(this.workingHourForm.controls.startpicker.value);
        this._data.property.fullday.end_time = this.timeReformat(this.workingHourForm.controls.endpicker.value);
        this._data.property.halfday.AM.start_time = this.timeReformat(this.workingHourForm.controls.starthalfdayAMpicker.value);
        this._data.property.halfday.AM.end_time = this.timeReformat(this.workingHourForm.controls.endhalfdayAMpicker.value);
        this._data.property.halfday.PM.start_time = this.timeReformat(this.workingHourForm.controls.starthalfdayPMpicker.value);
        this._data.property.halfday.PM.end_time = this.timeReformat(this.workingHourForm.controls.endhalfdayPMpicker.value);
        Object.keys(this._data.property.halfday).map(ampm => {
            Object.keys(this._data.property.halfday[ampm]).map(startend => {
                this._data.property.halfday[ampm][startend] = this._data.property.halfday[ampm][startend];
            })
        });
        this.postQuarterDay();
        this.patchWorkingHourSetup(this._data);
    }

    /**
     * get quarter day data before send to endpoint
     * @memberof WorkingHourComponent
     */
    postQuarterDay() {
        this._data.property.quarterday.Q1.start_time = this.timeReformat(this.workingHourForm.controls.startQ1picker.value);
        this._data.property.quarterday.Q1.end_time = this.timeReformat(this.workingHourForm.controls.endQ1picker.value);
        this._data.property.quarterday.Q2.start_time = this.timeReformat(this.workingHourForm.controls.startQ2picker.value);
        this._data.property.quarterday.Q2.end_time = this.timeReformat(this.workingHourForm.controls.endQ2picker.value);
        this._data.property.quarterday.Q3.start_time = this.timeReformat(this.workingHourForm.controls.startQ3picker.value);
        this._data.property.quarterday.Q3.end_time = this.timeReformat(this.workingHourForm.controls.endQ3picker.value);
        this._data.property.quarterday.Q4.start_time = this.timeReformat(this.workingHourForm.controls.startQ4picker.value);
        this._data.property.quarterday.Q4.end_time = this.timeReformat(this.workingHourForm.controls.endQ4picker.value);
        Object.keys(this._data.property.quarterday).map(objKey => {
            Object.keys(this._data.property.quarterday[objKey]).map(endstart => {
                this._data.property.quarterday[objKey][endstart] = this._data.property.quarterday[objKey][endstart];
            })
        });
    }

    /**
     * update or create data of working hour profile
     * @param {*} body
     * @memberof WorkingHourComponent
     */
    patchWorkingHourSetup(body: any) {
        if (this.id != '') {
            // this.defaultProfileValue.emit(this.isDefaultProfile);
            this.workingHourAPI.patch_working_hours({
                "working_hours_guid": this.id,
                "data": body
            }).subscribe(res => {
                if (res[0] != undefined) {
                    this.workingHourAPI.showPopUp('Working hour profile was updated successfully', true);
                }
            }, error => {
                this.workingHourAPI.showPopUp(JSON.parse(error._body).error, false);
            })
            this.showSmallSpinner = false;
        } else {
            this.workingHourAPI.post_working_hours(body).subscribe(response => {
                if (response[0] != undefined) {
                    if (this.isDefaultProfile) {
                        this.workingHourAPI.post_profile_default('working-hour', response[0].WORKING_HOURS_GUID).subscribe(
                            data => {
                                this.workingHourAPI.showPopUp('New working hour profile was created successfully', true);
                            }
                        );
                    }
                    this.refreshProfile(response[0].WORKING_HOURS_GUID);
                }
            }, err => {
                this.workingHourAPI.showPopUp(err.statusText, false);
            })
            this.showSmallSpinner = false;
        }
    }

    /**
     * refresh saved data by sending back the editted working hour id
     * @param {string} id
     * @memberof WorkingHourComponent
     */
    refreshProfile(id: string) {
        this.valueChange.emit(id);
    }

    /**
     * to set value of default working hour profile
     * @param {*} evt
     * @memberof WorkingHourComponent
     */
    setDefaultProfile(evt) {
        this.isDefaultProfile = evt.target.checked;
    }

}