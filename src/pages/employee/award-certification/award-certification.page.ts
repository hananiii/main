import { Component, OnInit } from "@angular/core";
import { APIService } from "src/services/shared-service/api.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { genderStatus, maritalStatus } from "../personal-details/personal-details.service";

/**
 * award & certificate page
 * @export
 * @class AwardCertificationPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-award-certification',
    templateUrl: './award-certification.page.html',
    styleUrls: ['./award-certification.page.scss'],
})
export class AwardCertificationPage implements OnInit {

    /**
     * percentage of completensss
     * @type {number}
     * @memberof AwardCertificationPage
     */
    // public progressPercentage: number;

    /**
     * show/hide progress bar percentage
     * @type {boolean}
     * @memberof AwardCertificationPage
     */
    // public showHeader: boolean = true;

    /**
     * show/hide content before loading complete
     * @type {boolean}
     * @memberof AwardCertificationPage
     */
    public showContent: boolean = false;

    /**
     * data of personal details from API
     * @type {*}
     * @memberof AwardCertificationPage
     */
    public items: any;

    /**
     * awards details
     * @type {*}
     * @memberof AwardCertificationPage
     */
    public awards: any = [];

    /**
     * Local property to show or hide edit profile
     * @type {boolean}
     * @memberof AwardCertificationPage
     */
    public showEditProfile: boolean = false;

    /**
     * img/pdf src url
     * @type {*}
     * @memberof AwardCertificationPage
     */
    public imgURL: any;

    /**
     * show/hide img
     * @type {boolean}
     * @memberof AwardCertificationPage
     */
    public showImg: boolean = false;

    /**
     * show/hide pdf
     * @type {boolean}
     * @memberof AwardCertificationPage
     */
    public showPdf: boolean = false;

    /**
     * show.hide attachment button
     * @type {boolean}
     * @memberof AwardCertificationPage
     */
    public showAttach: boolean = true;

    /**
     * employment details from requested Id
     * @type {*}
     * @memberof AwardCertificationPage
     */
    public employ: any;

    /** 
     * show loading spinner during waiting requested data
     * @type {boolean}
     * @memberof AwardCertificationPage
     */
    public showSpinner: boolean = false;

    /**
     * object of form field awards
     * @memberof AwardCertificationPage
     */
    public awardObj = { certificationName: '', certificationEnrollYear: '', certificationGraduateYear: '', certificationAttachment: '' };

    /**
     * validation group of file
     * @private
     * @type {FormGroup}
     * @memberof AwardCertificationPage
     */
    private _fileform: FormGroup;

    /**
     * file name get from input
     * @private
     * @memberof AwardCertificationPage
     */
    private _imagePath: any;

    /**
     * return personal details from API
     * @readonly
     * @memberof AwardCertificationPage
     */
    get personalList() {
        return this.items;
    }

    /**
     *Creates an instance of AwardCertificationPage.
     * @param {APIService} apiService
     * @param {FormBuilder} fb
     * @param {PersonalDetailsService} xservice
     * @memberof AwardCertificationPage
     */
    constructor(private apiService: APIService, private fb: FormBuilder) {

        // private xservice: PersonalDetailsService
        // xservice.percentChanged.subscribe(value => {
        //     this.progressPercentage = value;
        // })
    }

    ngOnInit() {
        this.showSpinner = true;
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.items = data;
                this.showSpinner = false;
                this.apiService.get_employment_details(this.items.id).subscribe(
                    data => {
                        this.employ = data;
                    })
                this.showContent = true;
                const award = this.items.personalDetail.certification;
                if (award != undefined) {
                    if (award.certificationDetail instanceof Array) {
                        this.awards = award.certificationDetail;
                    } else {
                        this.awards.push(award.certificationDetail);
                    }
                } else {
                    this.awards = [];
                }
            });

        this._fileform = this.fb.group({
            file: ''
        });
    }

    /**
     * get details of file after upload from local file
     * @param {*} files
     * @param {number} i
     * @returns
     * @memberof AwardCertificationPage
     */
    preview(files: any, i: number) {
        if (files.length === 0)
            return;
        const mimeType = files[0].type;
        this.awards[i].certificationAttachment = files[0].name;
        if (mimeType.match(/image\/*/) == null) {
            this.showPdf = true;
            this.showAttach = false;
            const reader = new FileReader();
            this._imagePath = files;
            reader.readAsDataURL(files[0]);
            reader.onload = (_event) => {
                this.imgURL = reader.result;
            }
            return;
        }
        this.readFile(files);
    }

    /**
     * read file of attachment
     * @param {*} files
     * @memberof AwardCertificationPage
     */
    readFile(files) {
        this.showImg = true;
        this.showAttach = false;
        const reader = new FileReader();
        this._imagePath = files;
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) => {
            this.imgURL = reader.result;
        }
    }

    /**
     * hide attached file (after clicked close icon)
     * @memberof AwardCertificationPage
     */
    clickToHideAttachment() {
        this.imgURL = null;
        this.showPdf = false;
        this.showImg = false;
    }

    /**
     * upload awards & certification details to API
     * @param {number} [index]
     * @memberof AwardCertificationPage
     */
    updateCertificate(index?: number) {
        const body = this.items.personalDetail;
        body['id'] = this.items.id;
        body.nric = this.items.personalDetail.nric.toString();
        body.gender = Number(genderStatus[this.items.personalDetail.gender]);
        body.maritalStatus = Number(maritalStatus[this.items.personalDetail.maritalStatus]);
        body.postcode = this.items.personalDetail.postcode.toString();
        if (body.certification != undefined) {
            body.certification.certificationDetail = this.awards;
        } else {
            body['certification'] = {};
            body['certification']['certificationDetail'] = this.awards;
        }
        this.getPatchedValue(body);
    }

    /**
     * get back patched value
     * @param {*} body
     * @memberof AwardCertificationPage
     */
    getPatchedValue(body: any) {
        this.apiService.patch_personal_details(body).subscribe(response => {
            this.apiService.get_personal_details().subscribe(
                (data: any[]) => {
                    this.items = data;
                    this.clickToHideAttachment();
                })
        })
    }

    /**
     * add new form field
     * @param {*} details
     * @param {Object} item
     * @memberof AwardCertificationPage
     */
    addInput(details: any, item: Object) {
        if (details !== undefined) {
            details.push(item);
            this.awardObject(details, item);
        } else {
            details = [];
            details.push(item);
            this.awardObject(details, item);
        }
    }

    /**
     * This method is used to get object format   
     * @param {*} list
     * @param {*} obj
     * @memberof PersonalDetailsPage
     */
    awardObject(list, obj) {
        if (obj === this.awardObj) { this.awards = list; }
    }


    /**
     * delete unwanted items
     * @param {number} i
     * @param {*} awards
     * @memberof AwardCertificationPage
     */
    deleteItem(i: number, awards: any) {
        this.awards.splice(i, 1);
    }
}