import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { genderStatus, maritalStatus } from './personal-details.service';
const moment = _moment;
/**
 * Personal Details Page
 * @export
 * @class PersonalDetailsPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-personal-details',
    templateUrl: './personal-details.page.html',
    styleUrls: ['./personal-details.page.scss']
})
export class PersonalDetailsPage implements OnInit {

    /**
     * Local property to get value from API
     * @type {*}
     * @memberof PersonalDetailsPage
     */
    public items: any;

    /**
     * Empty array to save emergency contact
     * @type {*}
     * @memberof PersonalDetailsPage
     */
    public removeItems: any = [];

    /**
     * Empty array to save spouse info
     * @type {*}
     * @memberof PersonalDetailsPage
     */
    public spouseItems: any = [];

    /**
     * Empty array to save child info
     * @type {*}
     * @memberof PersonalDetailsPage
     */
    public childItems: any = [];

    /**
     * Empty array to save education info
     * @type {*}
     * @memberof PersonalDetailsPage
     */
    public eduList: any = [];

    /**
     *
     * Local property to show or hide header of profile completeness
     * @type {boolean}
     * @memberof PersonalDetailsPage
     */
    public showHeader: boolean = true;

    /**
     * Local property to show value of profile completeness in %
     * @type {number}
     * @memberof PersonalDetailsPage
     */
    public progressPercentage: number = 80;

    /** 
     * Local property to show or hide loading spinner
     * @type {boolean}
     * @memberof PersonalDetailsPage
     */
    public showSpinner: boolean = true;

    /**
     * Local property to show or hide edit profile
     * @type {boolean}
     * @memberof PersonalDetailsPage
     */
    public showEditProfile: boolean = false;

    /**
     * Local property to show or hide edit contact info
     * @type {boolean[]}
     * @memberof PersonalDetailsPage
     */
    public showEditContact: boolean[] = [];

    /**
     * Local property to show or hide family info
     * @type {boolean}
     * @memberof PersonalDetailsPage
     */
    public showFamily: boolean = false;

    /**
     * Local property to show or hide education info
     * @type {boolean}
     * @memberof PersonalDetailsPage
     */
    public showEducation: boolean = false;

    /**
     * Show edit spouse form field 
     * @type {boolean[]}
     * @memberof PersonalDetailsPage
     */
    public displayEditSpouse: boolean[] = [];

    /**
     * Show edit child form field
     * @type {boolean[]}
     * @memberof PersonalDetailsPage
     */
    public displayEditChild: boolean[] = [];

    /**
     * Show edit education form field
     * @type {boolean[]}
     * @memberof PersonalDetailsPage
     */
    public displayEditEdu: boolean[] = [];

    /**
     * Object format of emergency contact
     * @memberof PersonalDetailsPage
     */
    public contactObj = { contactName: '', contactNumber: '' };

    /**
     * Object format of spouse details
     * @memberof PersonalDetailsPage
     */
    public spouseObj = { spouseName: '', spouseIdentificationNumber: '' };

    /**
     * Object format of child details
     * @memberof PersonalDetailsPage
     */
    public childObj = { childName: '', childIdentificationNumber: '' };

    /**
     * Object format of education details
     * @memberof PersonalDetailsPage
     */
    public educationObj = { qualificationLevel: '', major: '', university: '', year: '' };

    /**
     * Local private property for form group validation
     * @private
     * @type {FormGroup}
     * @memberof PersonalDetailsPage
     */
    private _date: FormGroup;

    /**
     * Local property to set subscription
     * @private
     * @type {Subscription}
     * @memberof PersonalDetailsPage
     */
    private subscription: Subscription = new Subscription();

    /**
     * Return API content of personal details
     * @readonly
     * @memberof PersonalDetailsPage
     */
    get personalList() {
        return this.items;
    }

    /**
     * Return dob value
     * @readonly
     * @type {FormGroup}
     * @memberof PersonalDetailsPage
     */
    get dateForm(): FormGroup {
        return this._date;
    }

    /**
     *Creates an instance of PersonalDetailsPage.
     * @param {APIService} apiService
     * @param {FormBuilder} _formBuilder
     * @memberof PersonalDetailsPage
     */
    constructor(private apiService: APIService,
        private _formBuilder: FormBuilder) {
    }

    /**
     * Inital method
     * Get personal details from API
     * @memberof PersonalDetailsPage
     */
    ngOnInit() {
        this.subscription = this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.items = data;
                this.showSpinner = false;
                this._date = this._formBuilder.group({ firstPicker: ['', Validators.required] });
                this._date = new FormGroup({
                    firstPicker: new FormControl(new Date(this.items.personalDetail.dob))
                })
                this.initContact();
                this.initSpouse();
                this.initChild();
                this.initEducation();
            },
            error => {
                if (error.status === 401) {
                    window.location.href = '/login';
                }
            });
    }

    /**
     * This is method used to destroy subscription
     * @memberof PersonalDetailsPage
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * This is method used to get contact info initially
     * @memberof PersonalDetailsPage
     */
    initContact() {
        if ((this.items.personalDetail.emergencyContactNumber.contacts instanceof Array) && this.items.personalDetail.emergencyContactNumber.contacts !== undefined) {
            this.removeItems = (this.items.personalDetail.emergencyContactNumber.contacts);
            for (let i = 0; i < this.removeItems.length; i++) {
                this.showEditContact.push(false);
            }
        }
        else if (!(this.items.personalDetail.emergencyContactNumber.contacts instanceof Array) && this.items.personalDetail.emergencyContactNumber.contacts !== undefined) {
            this.removeItems.push(this.items.personalDetail.emergencyContactNumber.contacts);
            for (let i = 0; i < this.removeItems.length; i++) {
                this.showEditContact.push(false);
            }
        }
        else {
            this.removeItems = this.items.personalDetail.emergencyContactNumber.contacts;
        }
    }

    /**
     * This is method used to get spouse info initially
     * @memberof PersonalDetailsPage
     */
    initSpouse() {
        if ((this.items.personalDetail.family.spouse instanceof Array) && this.items.personalDetail.family.spouse !== undefined) {
            this.showFamily = true;
            this.spouseItems = (this.items.personalDetail.family.spouse);
            for (let i = 0; i < this.spouseItems.length; i++) {
                this.displayEditSpouse.push(false);
            }
        }
        else if (!(this.items.personalDetail.family.spouse instanceof Array) && this.items.personalDetail.family.spouse !== undefined) {
            this.showFamily = true;
            this.spouseItems.push(this.items.personalDetail.family.spouse);
            for (let i = 0; i < this.spouseItems.length; i++) {
                this.displayEditSpouse.push(false);
            }
        } else {
            this.showFamily = false;
            this.spouseItems = this.items.personalDetail.family.spouse;
        }
    }

    /**
     * This is method used to get child info initially
     * @memberof PersonalDetailsPage
     */
    initChild() {
        if ((this.items.personalDetail.family.child instanceof Array) && this.items.personalDetail.family.child !== undefined) {
            this.showFamily = true;
            this.childItems = (this.items.personalDetail.family.child);
            for (let i = 0; i < this.childItems.length; i++) {
                this.displayEditChild.push(false);
            }
        }
        else if (!(this.items.personalDetail.family.child instanceof Array) && this.items.personalDetail.family.child !== undefined) {
            this.showFamily = true;
            this.childItems.push(this.items.personalDetail.family.child);
            for (let i = 0; i < this.childItems.length; i++) {
                this.displayEditChild.push(false);
            }
        } else {
            this.childItems = this.items.personalDetail.family.child;
        }
    }

    /**
     * This is method used to get education info initially
     * @memberof PersonalDetailsPage
     */
    initEducation() {
        if ((this.items.personalDetail.education.educationDetail instanceof Array) && this.items.personalDetail.education.educationDetail !== undefined) {
            this.showEducation = true;
            this.eduList = (this.items.personalDetail.education.educationDetail);
            for (let j = 0; j < this.eduList.length; j++) {
                this.displayEditEdu.push(false);
            }
        }
        else if (!(this.items.personalDetail.education.educationDetail instanceof Array) && this.items.personalDetail.education.educationDetail !== undefined) {
            this.showEducation = true;
            this.eduList.push(this.items.personalDetail.education.educationDetail);
            for (let j = 0; j < this.eduList.length; j++) {
                this.displayEditEdu.push(false);
            }
        } else {
            this.showEducation = false;
            this.eduList = this.items.personalDetail.education.educationDetail;
        }
    }

    /**
     * This is method used to create new form
     * @param {*} data
     * @param {Object} item
     * @memberof PersonalDetailsPage
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
     * @memberof PersonalDetailsPage
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
     * @memberof PersonalDetailsPage
     */
    removeItem(index: number, list: any) {
        list.splice(index, 1);
        this.patchData();
    }

    /**
     * This method is used to show edit contact details after clicked 
     * @param {number} i
     * @param {boolean} booValue
     * @memberof PersonalDetailsPage
     */
    editContact(i: number, booValue: boolean) {
        for (let j = 0; j < this.removeItems.length; j++) {
            this.showEditContact.splice(i, 1, booValue);
        }
    }

    /**
     * This method is used to show edit spouse details after clicked 
     * @param {number} i
     * @param {boolean} value
     * @memberof PersonalDetailsPage
     */
    editSpouse(i: number, value: boolean) {
        for (let j = 0; j < this.spouseItems.length; j++) {
            this.displayEditSpouse.splice(i, 1, value);
            if ((this.spouseItems[j].spouseName == '' || this.spouseItems[j].spouseIdentificationNumber == '') && !value) {
                this.removeItem(j, this.spouseItems);
            }
        }
    }

    /**
     * This method is used to show edit child details after clicked 
     * @param {number} i
     * @param {boolean} value
     * @memberof PersonalDetailsPage
     */
    editChild(i: number, value: boolean) {
        for (let j = 0; j < this.childItems.length; j++) {
            this.displayEditChild.splice(i, 1, value);
            if ((this.childItems[j].childName == '' || this.childItems[j].childIdentificationNumber == '') && !value) {
                this.removeItem(j, this.childItems);
            }
        }
    }

    /**
     * This method is used to show edit education details after clicked 
     * @param {number} i
     * @param {boolean} value
     * @memberof PersonalDetailsPage
     */
    editEducation(i: number, value: boolean) {
        for (let j = 0; j < this.eduList.length; j++) {
            this.displayEditEdu.splice(i, 1, value);
            if ((this.eduList[j].qualificationLevel == '' || this.eduList[j].major == '' || this.eduList[j].university == '' || this.eduList[j].year == '') && !value) {
                this.removeItem(j, this.eduList);
            }
        }
    }

    /**
     * This method is used to patch edited value back to server API
     * @memberof PersonalDetailsPage
     */
    patchData() {
        this.showEditProfile = false;
        this.subscription = this.apiService.patch_personal_details(this.data()).subscribe(
            (val) => {
                this.subscription = this.apiService.get_personal_details().subscribe(
                    (data: any[]) => {
                        this.items = data;
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
     * @memberof PersonalDetailsPage
     */
    data() {
        return {
            "id": this.items.id,
            "nickname": 'wantan',
            "nric": this.items.personalDetail.nric.toString(),
            "dob": moment(this._date.value.firstPicker).format('YYYY-MM-DD'),
            "gender": genderStatus[this.items.personalDetail.gender],
            "maritalStatus": maritalStatus[this.items.personalDetail.maritalStatus],
            "race": this.items.personalDetail.race,
            "religion": this.items.personalDetail.religion,
            "nationality": this.items.personalDetail.nationality,
            "phoneNumber": this.items.personalDetail.phoneNumber.toString(),
            "workPhoneNumber": this.items.personalDetail.workPhoneNumber.toString(),
            "emailAddress": this.items.personalDetail.emailAddress,
            "workEmailAddress": this.items.personalDetail.workEmailAddress,
            "address1": this.items.personalDetail.residentialAddress1.toString(),
            "address2": this.items.personalDetail.residentialAddress2.toString(),
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
