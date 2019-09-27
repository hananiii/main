import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';
import { PersonalDetailsService } from '../personal-details/personal-details.service';
/**
 * Leave Entitlement Page
 * @export
 * @class LeaveEntitlementsComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-leave-entitlement',
    templateUrl: './leave-entitlement.component.html',
    styleUrls: ['./leave-entitlement.component.scss'],
})
export class LeaveEntitlementsComponent implements OnInit {
    /**
     * This is local property used to get user profile list from API
     * @type {*}
     * @memberof LeaveEntitlementsComponent
     */
    public personalDataList: any;

    /**
     * This is local property used to show header profile completeness
     * @type {boolean}
     * @memberof LeaveEntitlementsComponent
     */
    public showHeader: boolean = true;

    /**
     * This is local property used to show profile completeness %
     * @type {number}
     * @memberof LeaveEntitlementsComponent
     */
    // public progressPercentage: number = 80;

    /**
     * This is local property used to show arrow down icon
     * @type {boolean}
     * @memberof LeaveEntitlementsComponent
     */
    // public arrowDown: boolean = true;

    /**
     * This is local property used to get the entitlement details from API
     * @type {*}
     * @memberof LeaveEntitlementsComponent
     */
    public entitlement: any;

    /**
     * This is local property used to get leave types
     * @type {string}
     * @memberof LeaveEntitlementsComponent
     */
    public leaveType: string;

    /**
     * This is local property used to get leave balances
     * @type {string}
     * @memberof LeaveEntitlementsComponent
     */
    public leaveBalance: string;

    /**
     * This is local property used to show loading spinner
     * @type {boolean}
     * @memberof LeaveEntitlementsComponent
     */
    public showSpinner: boolean = true;

    /**
   * Local property to show or hide content during loading
   * @type {boolean}
   * @memberof LeaveEntitlementsComponent
   */
    public showContent: boolean = false;

    /**
     * Return either arrow down or arrow up icon 
     * @readonly
     * @type {boolean}
     * @memberof LeaveEntitlementsComponent
     */
    // public get sortDirectionArrowDown(): boolean {
    //     return this.arrowDown;
    // }

    /**
     * Return API content
     * @readonly
     * @memberof LeaveEntitlementsComponent
     */
    public get personalList() {
        return this.personalDataList;
    }

    /**
     *Creates an instance of LeaveEntitlementsComponent.
     * @param {APIService} apiService
     * @param {Router} router
     * @memberof LeaveEntitlementsComponent
     */
    constructor(private apiService: APIService, private router: Router
    ) {
        // xservice.percentChanged.subscribe(value => {
        //     this.progressPercentage = value;
        // })
    }

    /**
     * Initial method
     * Get user profile details from API
     * @memberof LeaveEntitlementsComponent
     */
    ngOnInit() {
        this.apiService.get_user_profile().subscribe(
            (data: any[]) => {
                this.personalDataList = data;
                this.entitlement = this.personalDataList.entitlementDetail;
                this.showSpinner = false;
                this.showContent = true;
                // this.setTwoDigit();
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }


    /**
     * This method is used to route to apply leave menu with query parameters (leave type, leave balance)
     * @param {string} leaveType
     * @param {string} leaveBalance
     * @param {string} leaveId
     * @memberof LeaveEntitlementsComponent
     */
    toPlanLeave(leaveType: string, leaveBalance: string, leaveId: string) {
        this.router.navigate(['/main/plan-my-leave'], { queryParams: { type: leaveType, balance: leaveBalance, id: leaveId } });
        this.leaveType = leaveType;
        this.leaveBalance = leaveBalance;
    }

    /**
     * This method is used to sort leave type column in ascending order
     * @memberof LeaveEntitlementsComponent
     */
    // sortAscLeaveType() {
    //     this.arrowDown = true;
    //     this.entitlement = this.entitlement.slice(0);
    //     this.entitlement.sort(function (a, b) {
    //         const nameX = a.leaveTypeName.toLowerCase();
    //         const nameY = b.leaveTypeName.toLowerCase();
    //         return nameX < nameY ? -1 : nameX > nameY ? 1 : 0;
    //     });
    // }

    /**
     * This method is used to sort leave type column in descending order
     * @memberof LeaveEntitlementsComponent
     */
    // sortDesLeaveType() {
    //     this.arrowDown = false;
    //     this.entitlement = this.entitlement.slice(0);
    //     this.entitlement.sort(function (a, b) {
    //         const nameX = a.leaveTypeName.toLowerCase();
    //         const nameY = b.leaveTypeName.toLowerCase();
    //         return nameX < nameY ? 1 : nameX > nameY ? -1 : 0;
    //     });
    // }
}



