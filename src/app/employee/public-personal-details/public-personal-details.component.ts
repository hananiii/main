import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
const moment = _moment;
/**
 * Public Personal Details Page
 * @export
 * @class PublicPersonalDetailsComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-public-personal-details',
    templateUrl: './public-personal-details.component.html',
    styleUrls: ['./public-personal-details.component.scss'],
})
export class PublicPersonalDetailsComponent implements OnInit {

    /**
     * Local property for user profile details value from API
     * @type {*}
     * @memberof PublicPersonalDetailsComponent
     */
    public list: any;

    /**
     * Local property for personal details value from API
     * @type {*}
     * @memberof PublicPersonalDetailsComponent
     */
    public personalItem: any;

    /**
     * Local property for personal name value from API
     * @type {string}
     * @memberof PublicPersonalDetailsComponent
     */
    public personalName: string;

    /**
     * Local property for array of favourite name card list
     * @memberof PublicPersonalDetailsComponent
     */
    public setAsFavourite = [];

    /**
     * Local property for show colored star icon on clicked star 
     * @type {boolean}
     * @memberof PublicPersonalDetailsComponent
     */
    public numOfArray: boolean = false;

    /**
     * show loading spinner when the page loading
     * @type {boolean}
     * @memberof PublicPersonalDetailsComponent
     */
    public showSpinner: boolean = true;

    /**
     * user id pass get from clicked name
     * @private
     * @type {string}
     * @memberof PublicPersonalDetailsComponent
     */
    private _guid: string;

    /**
     * return requested personal details
     * @readonly
     * @memberof PublicPersonalDetailsComponent
     */
    get personalList() {
        return this.list;
    }

    /**
     *Creates an instance of PublicPersonalDetailsComponent.
     * @param {APIService} apiService
     * @param {ActivatedRoute} route
     * @param {Router} router
     * @memberof PublicPersonalDetailsComponent
     */
    constructor(private apiService: APIService, private route: ActivatedRoute,
        public router: Router) {
        route.queryParams
            .subscribe((params) => {
                this._guid = params.GUID;
                this.apiService.get_user_profile_details(this._guid).subscribe(
                    (data: any[]) => {
                        this.showSpinner = false;
                        this.list = data;
                        this.list.personalDetail.dob = moment(this.list.personalDetail.dob).format('DD-MM-YYYY');
                    },
                    error => {
                        if (error.status === 401) {
                            window.location.href = '/login';
                        }
                    },
                );
            });
    }


    /**
     * Initial method
     * @memberof PublicPersonalDetailsComponent
     */
    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.personalItem = data;
                this.personalName = this.personalItem.employeeName;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    /**
     * show or hide colored star icon
     * @memberof PublicPersonalDetailsComponent
     */
    clickAsFavourite() {
        if (this.numOfArray) {
            this.numOfArray = false;
        } else { this.numOfArray = true; }
        // this.numOfArray = true;
    };

}
