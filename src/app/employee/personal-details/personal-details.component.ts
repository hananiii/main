import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Validators, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { genderStatus, maritalStatus, PersonalDetailsService } from './personal-details.service';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { APP_DATE_FORMATS, AppDateAdapter } from '../date.adapter';
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
     *
     * Local property to show or hide header of profile completeness
     * @type {boolean}
     * @memberof PersonalDetailsComponent
     */
    public showHeader: boolean = true;

    /**
     * Local property to show value of profile completeness in %
     * @type {number}
     * @memberof PersonalDetailsComponent
     */
    public progressPercentage: number;

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
     * Local property to show or hide edit contact info
     * @type {boolean[]}
     * @memberof PersonalDetailsComponent
     */
    // public showEditContact: boolean[] = [];

    /**
     * Local property to show or hide family info
     * @type {boolean}
     * @memberof PersonalDetailsComponent
     */
    // public showFamily: boolean = false;

    /**
     * Local property to show or hide education info
     * @type {boolean}
     * @memberof PersonalDetailsComponent
     */
    // public showEducation: boolean = false;

    /**
     * Show edit spouse form field 
     * @type {boolean[]}
     * @memberof PersonalDetailsComponent
     */
    // public displayEditSpouse: boolean[] = [];

    /**
     * Show edit child form field
     * @type {boolean[]}
     * @memberof PersonalDetailsComponent
     */
    // public displayEditChild: boolean[] = [];

    /**
     * Show edit education form field
     * @type {boolean[]}
     * @memberof PersonalDetailsComponent
     */
    // public displayEditEdu: boolean[] = [];

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
     * Return API content of personal details
     * @readonly
     * @memberof PersonalDetailsComponent
     */
    get personalList() {
        return this.items;
    }

    /**
     *Creates an instance of PersonalDetailsComponent.
     * @param {APIService} apiService
     * @param {PersonalDetailsService} xservice
     * @memberof PersonalDetailsComponent
     */
    constructor(private apiService: APIService, private xservice: PersonalDetailsService) {
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
                this.checkProfileComplete();
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
            },
            error => {
                if (error.status === 401) {
                    window.location.href = '/login';
                }
            });
    }

    /**
     * Calculate profile completeness %
     * @memberof PersonalDetailsComponent
     */
    checkProfileComplete() {
        const value = (Object.keys(this.items.personalDetail).map(key => this.items.personalDetail[key]));
        const array = [];
        for (let i = 0; i < value.length; i++) {
            if (value[i] === "" || value[i] === null) {
                array.push(i);
            }
        }
        this.progressPercentage = Math.floor(((value.length - array.length) / value.length) * 100);
        this.xservice.percentChanged.next(this.progressPercentage);
    }

    /**
     * This is method used to get contact info initially
     * @memberof PersonalDetailsComponent
     */
    initContact() {
        if ((this.items.personalDetail.emergencyContact.contacts instanceof Array) && this.items.personalDetail.emergencyContact.contacts !== undefined) {
            this.removeItems = (this.items.personalDetail.emergencyContact.contacts);
            // for (let i = 0; i < this.removeItems.length; i++) {
            //     this.showEditContact.push(false);
            // }
        }
        else if (!(this.items.personalDetail.emergencyContact.contacts instanceof Array) && this.items.personalDetail.emergencyContact.contacts !== undefined) {
            this.removeItems.push(this.items.personalDetail.emergencyContact.contacts);
            // for (let i = 0; i < this.removeItems.length; i++) {
            //     this.showEditContact.push(false);
            // }
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
            // this.showFamily = true;
            this.spouseItems = (this.items.personalDetail.family.spouse);
            // for (let i = 0; i < this.spouseItems.length; i++) {
            //     this.displayEditSpouse.push(false);
            // }
        }
        else if (!(this.items.personalDetail.family.spouse instanceof Array) && this.items.personalDetail.family.spouse !== undefined) {
            // this.showFamily = true;
            this.spouseItems.push(this.items.personalDetail.family.spouse);
            // for (let i = 0; i < this.spouseItems.length; i++) {
            //     this.displayEditSpouse.push(false);
            // }
        } else {
            // this.showFamily = false;
            this.spouseItems = this.items.personalDetail.family.spouse;
        }
    }

    /**
     * This is method used to get child info initially
     * @memberof PersonalDetailsComponent
     */
    initChild() {
        if ((this.items.personalDetail.family.child instanceof Array) && this.items.personalDetail.family.child !== undefined) {
            // this.showFamily = true;
            this.childItems = (this.items.personalDetail.family.child);
            // for (let i = 0; i < this.childItems.length; i++) {
            //     this.displayEditChild.push(false);
            // }
        }
        else if (!(this.items.personalDetail.family.child instanceof Array) && this.items.personalDetail.family.child !== undefined) {
            // this.showFamily = true;
            this.childItems.push(this.items.personalDetail.family.child);
            // for (let i = 0; i < this.childItems.length; i++) {
            //     this.displayEditChild.push(false);
            // }
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
            // this.showEducation = true;
            this.eduList = (this.items.personalDetail.education.educationDetail);
            // for (let j = 0; j < this.eduList.length; j++) {
            //     this.displayEditEdu.push(false);
            // }
        }
        else if (!(this.items.personalDetail.education.educationDetail instanceof Array) && this.items.personalDetail.education.educationDetail !== undefined) {
            // this.showEducation = true;
            this.eduList.push(this.items.personalDetail.education.educationDetail);
            // for (let j = 0; j < this.eduList.length; j++) {
            //     this.displayEditEdu.push(false);
            // }
        } else {
            // this.showEducation = false;
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
        if (obj === this.contactObj) { this.removeItems = list; }
        if (obj === this.spouseObj) { this.spouseItems = list; }
        if (obj === this.childObj) { this.childItems = list; }
        if (obj === this.educationObj) { this.eduList = list; }
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
        this.apiService.patch_personal_details(this.data()).subscribe(
            (val) => {
                this.apiService.get_personal_details().subscribe(
                    (data: any[]) => {
                        this.items = data;
                        this.items.personalDetail.dob = moment(this.items.personalDetail.dob).format('DD-MM-YYYY');
                    }
                );
            },
            response => {
                if (response.status === 401) {
                    window.location.href = '/login';
                }
            });
    }

    /**
     * This method is used to format body according API model
     * @returns
     * @memberof PersonalDetailsComponent
     */
    data() {
        return {
            "id": this.items.id,
            "nickname": 'wantan',
            "nric": this.items.personalDetail.nric.toString(),
            "dob": moment(this.firstPicker.value).format('YYYY-MM-DD'),
            "gender": genderStatus[this.items.personalDetail.gender],
            "maritalStatus": maritalStatus[this.items.personalDetail.maritalStatus],
            "race": this.items.personalDetail.race,
            "religion": this.items.personalDetail.religion,
            "nationality": this.items.personalDetail.nationality,
            "phoneNumber": this.items.personalDetail.phoneNumber.toString(),
            "workPhoneNumber": this.items.personalDetail.workPhoneNumber.toString(),
            "emailAddress": this.items.personalDetail.emailAddress,
            "workEmailAddress": this.items.personalDetail.workEmailAddress,
            "address1": this.items.personalDetail.address1.toString(),
            "address2": this.items.personalDetail.address2.toString(),
            "postcode": this.items.personalDetail.postcode.toString(),
            "city": this.items.personalDetail.city,
            "state": this.items.personalDetail.state,
            "country": this.items.personalDetail.country,
            "emergencyContact": { "contacts": this.removeItems },
            "education": { "educationDetail": this.eduList },
            "family": {
                "spouse": this.spouseItems,
                "child": this.childItems
            }
        };
    }


}
