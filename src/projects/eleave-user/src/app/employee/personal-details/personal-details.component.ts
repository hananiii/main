import { Component, OnInit } from '@angular/core';
import { APIService } from '$user-root/src/services/shared-service/api.service';
import { Validators, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { APP_DATE_FORMATS, AppDateAdapter } from '../date.adapter';
import { EditModeDialogComponent } from '../edit-mode-dialog/edit-mode-dialog.component';
import { SnackbarNotificationComponent } from '../snackbar-notification/snackbar-notification.component';
import { SharedService } from '../shared.service';
const moment = _moment;
/**
 * Personal Details Page
 * @export
 * @class PersonalDetailsComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-personal-details',
    templateUrl: './personal-details.component.html',
    styleUrls: ['./personal-details.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class PersonalDetailsComponent implements OnInit {

    /**
     * Local property to get value from API
     * @type {*}
     * @memberof PersonalDetailsComponent
     */
    public items: any;

    /**
     * Empty array to save emergency contact
     * @type {*}
     * @memberof PersonalDetailsComponent
     */
    public removeItems: any = [];

    /**
     * Empty array to save spouse info
     * @type {*}
     * @memberof PersonalDetailsComponent
     */
    public spouseItems: any = [];

    /**
     * Empty array to save child info
     * @type {*}
     * @memberof PersonalDetailsComponent
     */
    public childItems: any = [];

    /**
     * Empty array to save education info
     * @type {*}
     * @memberof PersonalDetailsComponent
     */
    public eduList: any = [];

    /**
     * Local property to show or hide header of profile completeness
     * @type {boolean}
     * @memberof PersonalDetailsComponent
     */
    public showHeader: boolean = true;

    /** 
     * Local property to show or hide loading spinner
     * @type {boolean}
     * @memberof PersonalDetailsComponent
     */
    public showSpinner: boolean = true;

    /**
     * Local property to show or hide content during loading
     * @type {boolean}
     * @memberof PersonalDetailsComponent
     */
    public showContent: boolean = false;

    /**
     * Local property to show or hide edit profile
     * @type {boolean}
     * @memberof PersonalDetailsComponent
     */
    public showEditProfile: boolean = false;

    /**
     * Object format of emergency contact
     * @memberof PersonalDetailsComponent
     */
    public contactObj = { contactName: '', contactRelationship: '', contactNumber: '' };

    /**
     * Object format of spouse details
     * @memberof PersonalDetailsComponent
     */
    public spouseObj = { spouseName: '', spouseIdentificationNumber: '' };

    /**
     * Object format of child details
     * @memberof PersonalDetailsComponent
     */
    public childObj = { childName: '', childIdentificationNumber: '' };

    /**
     * Object format of education details
     * @memberof PersonalDetailsComponent
     */
    public educationObj = { qualificationLevel: '', major: '', university: '', year: '' };

    /**
     * date validation
     * @type {*}
     * @memberof PersonalDetailsComponent
     */
    public firstPicker: any;

    /**
     * employment details from API
     * @type {*}
     * @memberof PersonalDetailsComponent
     */
    public employ: any;

    /**
     * employment details from user-info
     * @type {*}
     * @memberof PersonalDetailsComponent
     */
    public employDetails: any;

    /**
     * toggle button value
     * @type {string}
     * @memberof PersonalDetailsComponent
     */
    public modeValue: string = 'OFF';

    /**
     * get url of personal profile picture
     * @type {*}
     * @memberof PersonalDetailsComponent
     */
    public url: any;

    /**
     *Creates an instance of PersonalDetailsComponent.
     * @param {APIService} apiService
     * @param {SharedService} sharedService
     * @memberof PersonalDetailsComponent
     */
    constructor(private apiService: APIService, private sharedService: SharedService) {
        this.apiService.get_profile_pic('personal').subscribe(img => this.url = img)
    }

    /**
     * Inital method
     * Get personal details from API
     * @memberof PersonalDetailsComponent
     */
    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.items = data;
                this.showSpinner = false;
                this.showContent = true;
                this.firstPicker = new FormControl((this.items.personalDetail.dob), Validators.required);
                this.items.personalDetail.dob = moment(this.items.personalDetail.dob).format('DD-MM-YYYY');
                this.initContact();
                this.initSpouse();
                this.initChild();
                this.initEducation();
                this.apiService.get_employment_details(this.items.id).subscribe(
                    data => {
                        this.employ = data;
                    })
                this.apiService.get_user_info_employment_details().subscribe(
                    dataUsrDtls => {
                        this.employDetails = dataUsrDtls;
                    })
            },
            error => {
                this.notification(JSON.parse(error._body).status, false);
            });
    }

    /**
     * toggle on/off of edit mode
     * @param {*} event
     * @memberof PersonalDetailsComponent
     */
    toggleEvent(event) {
        if (event.detail.checked === true) {
            this.modeValue = 'ON';
            this.apiService.matdialog.open(EditModeDialogComponent, {
                disableClose: true,
                data: 'personal',
                height: "343.3px",
                width: "383px",
                panelClass: 'custom-dialog-container'
            });
        } else {
            this.modeValue = 'OFF'
            this.patchData();
        }
        this.sharedService.emitChange(this.modeValue);
    }

    /**
     * This is method used to get contact info initially
     * @memberof PersonalDetailsComponent
     */
    initContact() {
        if ((this.items.personalDetail.emergencyContact.contacts instanceof Array) && this.items.personalDetail.emergencyContact.contacts !== undefined) {
            this.removeItems = (this.items.personalDetail.emergencyContact.contacts);
        }
        else if (!(this.items.personalDetail.emergencyContact.contacts instanceof Array) && this.items.personalDetail.emergencyContact.contacts !== undefined) {
            this.removeItems.push(this.items.personalDetail.emergencyContact.contacts);
        }
        else {
            this.removeItems = this.items.personalDetail.emergencyContact.contacts;
        }
    }

    /**
     * This is method used to get spouse info initially
     * @memberof PersonalDetailsComponent
     */
    initSpouse() {
        if ((this.items.personalDetail.family.spouse instanceof Array) && this.items.personalDetail.family.spouse !== undefined) {
            this.spouseItems = (this.items.personalDetail.family.spouse);
        }
        else if (!(this.items.personalDetail.family.spouse instanceof Array) && this.items.personalDetail.family.spouse !== undefined) {
            this.spouseItems.push(this.items.personalDetail.family.spouse);
        } else {
            this.spouseItems = this.items.personalDetail.family.spouse;
        }
    }

    /**
     * This is method used to get child info initially
     * @memberof PersonalDetailsComponent
     */
    initChild() {
        if ((this.items.personalDetail.family.child instanceof Array) && this.items.personalDetail.family.child !== undefined) {
            this.childItems = (this.items.personalDetail.family.child);
        }
        else if (!(this.items.personalDetail.family.child instanceof Array) && this.items.personalDetail.family.child !== undefined) {
            this.childItems.push(this.items.personalDetail.family.child);
        } else {
            this.childItems = this.items.personalDetail.family.child;
        }
    }

    /**
     * This is method used to get education info initially
     * @memberof PersonalDetailsComponent
     */
    initEducation() {
        if ((this.items.personalDetail.education.educationDetail instanceof Array) && this.items.personalDetail.education.educationDetail !== undefined) {
            this.eduList = (this.items.personalDetail.education.educationDetail);
        }
        else if (!(this.items.personalDetail.education.educationDetail instanceof Array) && this.items.personalDetail.education.educationDetail !== undefined) {
            this.eduList.push(this.items.personalDetail.education.educationDetail);
        } else {
            this.eduList = this.items.personalDetail.education.educationDetail;
        }
    }

    /**
     * This is method used to create new form
     * @param {*} data
     * @param {Object} item
     * @memberof PersonalDetailsComponent
     */
    addList(data: any, item: Object) {
        if (data !== undefined) {
            data.push(item);
            this.getObject(data, item);
        } else {
            data = [];
            data.push(item);
            this.getObject(data, item);
        }
    }

    /**
     * This method is used to get object format   
     * @param {*} list
     * @param {*} obj
     * @memberof PersonalDetailsComponent
     */
    getObject(list, obj) {
        if (obj === this.contactObj) {
            this.contactObj = { contactName: '', contactRelationship: '', contactNumber: '' };
            this.removeItems = list;
        }
        if (obj === this.spouseObj) {
            this.spouseObj = { spouseName: '', spouseIdentificationNumber: '' };
            this.spouseItems = list;
        }
        if (obj === this.childObj) {
            this.childObj = { childName: '', childIdentificationNumber: '' };
            this.childItems = list;
        }
        if (obj === this.educationObj) {
            this.educationObj = { qualificationLevel: '', major: '', university: '', year: '' };
            this.eduList = list;
        }
    }

    /**
     * This method is used to delete empty input form field 
     * @param {number} index
     * @param {*} list
     * @memberof PersonalDetailsComponent
     */
    removeItem(index: number, list: any) {
        list.splice(index, 1);
    }

    /**
     * This method is used to patch edited value back to server API
     * @memberof PersonalDetailsComponent
     */
    patchData() {
        this.showEditProfile = false;
        this.items.personalDetail.nric = this.items.personalDetail.nric.toString();
        this.items.personalDetail.dob = moment(this.items.personalDetail.dob).format('YYYY-MM-DD');
        this.apiService.patch_user_info_personal_id(this.data(), this.items.id).subscribe(
            (val) => {
                this.items.personalDetail = val;
                this.items.personalDetail.dob = moment(this.items.personalDetail.dob).format('DD-MM-YYYY');
                this.notification('Edit mode disabled. Good job!', true);
            },
            response => {
                this.notification(JSON.parse(response._body).status, false);
            });
    }

    /**
     * This method is used to format body according API model
     * @returns
     * @memberof PersonalDetailsComponent
     */
    data() {
        return {
            // "id": this.items.id,
            "fullname": this.items.personalDetail.fullname,
            "nickname": this.items.personalDetail.nickname,
            "nric": this.items.personalDetail.nric.toString(),
            "dob": moment(this.firstPicker.value).format('YYYY-MM-DD'),
            "gender": this.items.personalDetail.gender,
            "maritalStatus": this.items.personalDetail.maritalStatus,
            "race": this.items.personalDetail.race,
            "religion": this.items.personalDetail.religion,
            "nationality": this.items.personalDetail.nationality,
            "phoneNumber": this.items.personalDetail.phoneNumber.toString(),
            "workPhoneNumber": this.items.personalDetail.workPhoneNumber.toString(),
            "emailAddress": this.items.personalDetail.emailAddress,
            "workEmailAddress": this.items.personalDetail.workEmailAddress,
            "address1": this.items.personalDetail.address1.toString(),
            "address2": this.items.personalDetail.address2.toString(),
            "postcode": this.items.personalDetail.postcode,
            "city": this.items.personalDetail.city,
            "state": this.items.personalDetail.state,
            "country": this.items.personalDetail.country,
            "emergencyContact": { "contacts": this.removeItems },
            "certification": this.items.personalDetail.certification,
            "education": { "educationDetail": this.eduList },
            "family": {
                "spouse": this.spouseItems,
                "child": this.childItems
            }
        };
    }

    /**
     * Show notification after submit
     * @param {string} text
     * @param {boolean} val
     * @memberof PersonalDetailsComponent
     */
    notification(text: string, val: boolean) {
        this.apiService.snackbar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: text, response: val }
        });
    }




}
