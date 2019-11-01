import { Component, OnInit } from '@angular/core';
import { DeleteListConfirmationComponent } from '../delete-list-confirmation/delete-list-confirmation.component';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AdminInvitesApiService } from '../admin-invites-api.service';
import { DateDialogComponent } from '../date-dialog/date-dialog.component';
import * as _moment from 'moment';
import { EditModeDialogComponent } from '../../leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { LeaveApiService } from '../../leave-setup/leave-api.service';
import { FormControl, Validators } from '@angular/forms';
import { APP_DATE_FORMATS, AppDateAdapter } from '../../leave-setup/date.adapter';
const moment = _moment;

/**
 *
 * Invite List Page
 * @export
 * @class InviteListComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-invite-list',
    templateUrl: './invite-list.component.html',
    styleUrls: ['./invite-list.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class InviteListComponent implements OnInit {

    /**
     * Get user profile list from API
     * @type {*}
     * @memberof InviteListComponent
     */
    public list: any;

    // /**
    //  * Add as favourite list after clicked star icon
    //  * @memberof InviteListComponent
    //  */
    // public favouriteList = [];

    /**
     * Show spinner during loading
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public showSpinner: boolean = true;

    /**
     * current page of paginator
     * @type {number}
     * @memberof InviteListComponent
     */
    public p: number;

    /**
     * mode on/off
     * @type {string}
     * @memberof InviteListComponent
     */
    public mode: string = 'OFF';

    /**
     * user info personal-details
     * @type {*}
     * @memberof InviteListComponent
     */
    public personalDetails: any;

    /**
     * birthdate form control
     * @type {*}
     * @memberof InviteListComponent
     */
    public birthOfDate: any;

    /**
     * user info employment details
     * @type {*}
     * @memberof InviteListComponent
     */
    public employmentDetails: any;

    /**
     * date of join form control
     * @type {*}
     * @memberof InviteListComponent
     */
    public dateOfJoin: any;

    /**
     * date of confirm form control
     * @type {*}
     * @memberof InviteListComponent
     */
    public dateOfConfirm: any;

    /**
     * date of resign form control
     * @type {*}
     * @memberof InviteListComponent
     */
    public dateOfResign: any;

    /**
     * role profile list from API
     * @type {*}
     * @memberof InviteListComponent
     */
    public roleList: any;

    /**
     * calendar profile list from API
     * @type {*}
     * @memberof InviteListComponent
     */
    public calendarList: any;

    /**
     * working hour profile list from API
     * @type {*}
     * @memberof InviteListComponent
     */
    public workingList: any;

    /**
     * leave entitlement list from API
     * @type {*}
     * @memberof InviteListComponent
     */
    public entitlementList: any;

    /**
     * get selected user id
     * @type {string}
     * @memberof InviteListComponent
     */
    public userId: string;

    /**
     * day available for selected employee & leave type & leave entitled
     * @type {number}
     * @memberof InviteListComponent
     */
    public dayAvailable: number = 0;

    /**
     * clicked index 
     * @type {number}
     * @memberof InviteListComponent
     */
    public clickedIndex: number = 0;

    /**
     *Creates an instance of InviteListComponent.
     * @param {AdminInvitesApiService} inviteAPI
     * @param {MatDialog} popUp
     * @memberof InviteListComponent
     */
    constructor(private inviteAPI: AdminInvitesApiService, public popUp: MatDialog, private leaveApi: LeaveApiService) { }

    ngOnInit() {
        this.endPoint();
        this.inviteAPI.get_role_profile_list().subscribe(list => {
            this.roleList = list;
        })
        this.inviteAPI.get_calendar_profile_list().subscribe(list => {
            this.calendarList = list;
        })
        this.inviteAPI.get_working_hour_profile_list().subscribe(list => {
            this.workingList = list;
        })
        this.leaveApi.get_leavetype_entitlement().subscribe(list => {
            this.entitlementList = list;
        })
    }

    /**
     * Get user profile list from API
     * @memberof InviteListComponent
     */
    endPoint() {
        this.inviteAPI.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.showSpinner = false;
                this.list = data;
                this.getUserId(this.list[0].userId, 0, 1);
            }
        );
    }

    /**
     * get clicked user id
     * @param {string} userId
     * @param {number} index
     * @param {number} p
     * @memberof InviteListComponent
     */
    getUserId(userId: string, index: number, p: number) {
        if (p === undefined) {
            this.p = 1;
            p = 1;
        }
        this.clickedIndex = ((p - 1) * 7) + index;
        console.log(this.clickedIndex);
        this.userId = userId;
        this.inviteAPI.get_admin_user_info('personal-details', userId).subscribe(data => {
            console.log(data);
            this.personalDetails = data;
            this.birthOfDate = new FormControl((this.personalDetails.personalDetail.dob), Validators.required);
            this.personalDetails.personalDetail.dob = moment(this.personalDetails.personalDetail.dob).format('DD-MM-YYYY');
        })
        this.inviteAPI.get_admin_user_info('employment-detail', userId).subscribe(data => {
            console.log('employ', data);
            this.employmentDetails = data;
            this.dateOfJoin = new FormControl((this.employmentDetails.employmentDetail.dateOfJoin), Validators.required);
            this.employmentDetails.employmentDetail.dateOfJoin = moment(this.employmentDetails.employmentDetail.dateOfJoin).format('DD-MM-YYYY');
            this.dateOfConfirm = new FormControl((this.employmentDetails.employmentDetail.dateOfConfirmation), Validators.required);
            this.employmentDetails.employmentDetail.dateOfConfirmation = moment(this.employmentDetails.employmentDetail.dateOfConfirmation).format('DD-MM-YYYY');
            this.dateOfResign = new FormControl((this.employmentDetails.employmentDetail.dateOfResign), Validators.required);
            this.employmentDetails.employmentDetail.dateOfResign = moment(this.employmentDetails.employmentDetail.dateOfResign).format('DD-MM-YYYY');
        })
    }

    /**
     * assign employee to a selected leave entitlement
     * get day balance value
     * @param {*} leaveTypeId
     * @param {*} leaveEntitlementId
     * @memberof InviteListComponent
     */
    getLeaveTypeEntitlementId(leaveTypeId, leaveEntitlementId) {
        // POST and create directly
        const data = {
            "userId": [this.userId], "leaveTypeId": leaveTypeId, "leaveEntitlementId": leaveEntitlementId
        }
        this.leaveApi.post_leave_entitlement(data).subscribe(res => {
            console.log('res', res);
        })
        this.leaveApi.get_entilement_details(this.userId).subscribe(val => {
            console.log('entitledetails', val);
            for (let i = 0; i < val.length; i++) {
                if (val[i].LEAVE_TYPE_GUID == leaveTypeId) {
                    this.dayAvailable = val[i].BALANCE_DAYS;
                }
            }
        })
        console.log(leaveTypeId, leaveEntitlementId);
    }

    /**
     * toggle edit mode on/off
     * @param {*} evt
     * @memberof InviteListComponent
     */
    toggleMode(evt) {
        if (evt.detail.checked === true) {
            this.mode = 'ON';
            this.popUp.open(EditModeDialogComponent, {
                data: 'employee',
                height: "354.3px",
                width: "383px"
            });
        } else {
            this.mode = 'OFF';
            // this.inviteAPI.patch_admin_personal_user_info(this.personalDetails.personalDetail, this.userId).subscribe(res => console.log(res));
            // this.inviteAPI.patch_admin_employment_user_info(this.employmentDetails.employmentDetail, this.userId).subscribe(resp => console.log(resp));
            this.inviteAPI.showSnackbar('Edit mode disabled. Good job!', true);
        }
    }

    /**
     * Show view list or grid list items
     * @param {boolean} list
     * @param {number} pageItems
     * @param {number} range
     * @memberof InviteListComponent
     */
    // viewType(list: boolean, pageItems: number, range: number) {
    //     this.listView = list;
    //     this.gridView = !list;
    //     this.disableNextButton = false;
    //     this.disablePrevButton = true;
    //     this.itemsPerPage = pageItems;
    //     this.startEndNumber = range;
    //     this.loopItemsPerPage(1);
    // }

    /**
     * Calculate number of item show in each page
     * @param {number} index
     * @param {*} data
     * @param {number} itemEachPage
     * @param {*} startEndNumber
     * @memberof InviteListComponent
     */
    // loopItemsPerPage(index: number) {
    //     this.pageIndex = index;
    //     this.totalItem = this.list.length;
    //     this.totalPageIndex = this.totalItem / this.itemsPerPage;
    //     this.totalPageIndex = Math.ceil(this.totalPageIndex);
    //     const startNum = (this.pageIndex * this.itemsPerPage) - this.startEndNumber;
    //     const endNum = this.pageIndex * this.itemsPerPage;
    //     const currentPageItems = [];
    //     for (let j = startNum - 1; j < endNum; j++) {
    //         const itemNum = this.list[j];
    //         if (itemNum !== undefined) {
    //             currentPageItems.push(itemNum);
    //         }
    //     }
    //     this.currentPageItems = currentPageItems;
    // }

    /**
     * Enable or disable the next button
     * @memberof InviteListComponent
     */
    // enableDisableNextButton() {
    //     if (this.pageIndex === this.totalPageIndex) {
    //         this.disableNextButton = true;
    //     }
    //     if (this.pageIndex > 0 && this.pageIndex < this.totalPageIndex) {
    //         this.disableNextButton = false;
    //     }
    //     if (this.pageIndex > 1) {
    //         this.disablePrevButton = false;
    //     }
    // }

    /**
     * Enable or disable the previous button
     * @memberof InviteListComponent
     */
    // enableDisablePrevButton() {
    //     if (this.pageIndex < 2) {
    //         this.disablePrevButton = true;
    //     }
    //     if (this.pageIndex > 1 && this.pageIndex === this.totalPageIndex) {
    //         this.disablePrevButton = false;
    //     }
    //     if (this.pageIndex < this.totalPageIndex) {
    //         this.disableNextButton = false;
    //     }
    // }

    /**
     * Show calculated content items after clicked next button
     * @param {number} index
     * @memberof InviteListComponent
     */
    // clickToNextPage(index: number) {
    //     if (!(index > this.totalPageIndex)) {
    //         this.loopItemsPerPage(index);
    //     }
    //     this.enableDisableNextButton();
    // }

    /**
     * Show calculated content items after clicked previous button
     * @param {number} index
     * @memberof InviteListComponent
     */
    // clickToPrevPage(index: number) {
    //     if (!(index < 1)) {
    //         this.loopItemsPerPage(index);
    //     }
    //     this.enableDisablePrevButton();
    // }

    /**
     * Sort Name column after clicked arrow up or down icon
     * @param {boolean} booleanValue
     * @param {number} ascValue
     * @param {number} desValue
     * @memberof InviteListComponent
     */
    // sortName(booleanValue: boolean, ascValue: number, desValue: number) {
    //     this.arrowDownName = booleanValue;
    //     this.list = this.list.slice(0);
    //     this.list.sort(function (a, b) {
    //         var x = a.employeeName.toLowerCase();
    //         var y = b.employeeName.toLowerCase();
    //         return x < y ? ascValue : x > y ? desValue : 0;
    //     });
    //     this.loopItemsPerPage(1);
    //     this.disableNextButton = false;
    //     this.disablePrevButton = true;
    // }

    /**
     * Sort Id column after clicked arrow up or down icon
     * @param {boolean} value
     * @param {number} asc
     * @param {number} des
     * @memberof InviteListComponent
     */
    // sortId(value: boolean, asc: number, des: number) {
    //     this.arrowDownId = value;
    //     this.list = this.list.slice(0);
    //     this.list.sort(function (a, b) {
    //         var x = a.staffNumber;
    //         var y = b.staffNumber;
    //         return x < y ? asc : x > y ? des : 0;
    //     });
    //     this.loopItemsPerPage(1);
    //     this.disableNextButton = false;
    //     this.disablePrevButton = true;
    // }

    /**
     * Filter text key in from searchbar 
     * @param {*} text
     * @memberof InviteListComponent
     */
    filter(text: any) {
        if (text && text.trim() != '') {
            this.list = this.list.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
            // this.pageIndex = 1;
            // this.loopItemsPerPage(this.pageIndex);
            // this.enableDisableNextButton();
            // this.enableDisablePrevButton();
        }
    }

    /**
     * To filter entered text
     * @param {*} text
     * @memberof InviteListComponent
     */
    changeDetails(text: any) {
        if (text.srcElement.value === '') {
            this.endPoint();
            // this.disableNextButton = false;
            // this.disablePrevButton = true;
        } else {
            this.filter(text.srcElement.value);
        }
    }

    // /**
    //  * Check duplicate Id exist or not
    //  * @param {string} ID
    //  * @returns
    //  * @memberof InviteListComponent
    //  */
    // checkUserID(ID: string) {
    //     return this.favouriteList.some(function (el) {
    //         return el.itemId === ID;
    //     });
    // }

    /**
     * manage employee status 
     * @param {string} employeeName
     * @param {string} id
     * @param {string} name
     * @memberof InviteListComponent
     */
    setUserStatus(employeeName: string, id: string, name: string) {
        const deleteDialog = this.popUp.open(DeleteListConfirmationComponent, {
            data: { name: employeeName, value: id, action: name }
        });
        deleteDialog.afterClosed().subscribe(result => {
            if (result === id && name == 'delete') {
                this.showSpinner = true;
                this.inviteAPI.delete_user(id).subscribe(response => {
                    this.endPoint();
                })
            }
            if (result && name == 'disable') {
                this.disableUser(employeeName, id);
            }
        });
    }

    /**
     * disable user and set expiration date 
     * @param {string} employeeName
     * @param {string} id
     * @memberof InviteListComponent
     */
    disableUser(employeeName: string, id: string) {
        const disableDialog = this.popUp.open(DateDialogComponent, {
            data: { name: employeeName, value: id, action: name }
        });
        disableDialog.afterClosed().subscribe(value => {
            if (value) {
                this.showSpinner = true;
                this.inviteAPI.disable_user({
                    "user_guid": id,
                    "resign_date": moment(value).format('YYYY-MM-DD'),
                }).subscribe(response => {
                    this.endPoint();
                })
            }
        })
    }

    // /**
    //  * Save highlighted star icon name card
    //  * @param {number} index
    //  * @param {*} item
    //  * @memberof InviteListComponent
    //  */
    // saveAsFavourite(index: number, item: any) {
    //     const create = { index: index, itemId: item.id };
    //     const items = create;
    //     if (this.favouriteList.length > 0 && this.checkUserID(item.id)) {
    //         for (let i = 0; i < this.favouriteList.length; i++) {
    //             if (this.favouriteList[i].index == index && this.favouriteList[i].itemId == item.id) {
    //                 this.favouriteList.splice(i, 1);
    //             }
    //         }
    //     } else if (this.favouriteList.length > 0 && !this.checkUserID(item.id)) {
    //         this.favouriteList.push(items);
    //     } else {
    //         this.favouriteList.push(items);
    //     }
    // };

    /**
     * main checkbox value
     * @memberof InviteListComponent
     */
    // checkboxEvent() {
    //     this.hideAvatar = [];
    //     setTimeout(() => {
    //         this.list.forEach(value => {
    //             value.isChecked = this.mainCheck;
    //             if (value.isChecked) {
    //                 this.hideAvatar.push(true);
    //             } else {
    //                 this.hideAvatar.push(false);
    //             }
    //         });
    //     })
    // }

    /**
     * item checkbox value
     * @memberof InviteListComponent
     */
    // listEvent() {
    //     const totalNumber = this.list.length;
    //     let checkedLength = 0;
    //     this.list.map(item => {
    //         if (item.isChecked) {
    //             checkedLength++;
    //             this.hideAvatar.push(true);
    //         }
    //     });
    //     if (checkedLength > 0 && checkedLength < totalNumber) {
    //         this.indeterminateCheck = true;
    //         this.mainCheck = false;
    //     } else if (checkedLength == totalNumber) {
    //         this.mainCheck = true;
    //         this.indeterminateCheck = false;
    //     } else {
    //         this.indeterminateCheck = false;
    //         this.mainCheck = false;
    //     }
    // }

    /**
     * mouse in/out event
     * @param {number} idx
     * @param {boolean} value
     * @param {boolean} checkedValue
     * @memberof InviteListComponent
     */
    // mouseHoverEvent(idx: number, value: boolean, checkedValue: boolean) {
    //     if (checkedValue && (this.mainCheck || this.indeterminateCheck)) {
    //         this.hideAvatar = [];
    //         this.list.map(value => { this.hideAvatar.push(true); });
    //     } else if (!checkedValue && (this.mainCheck || this.indeterminateCheck)) {
    //         this.hideAvatar = [];
    //         this.list.map(() => { this.hideAvatar.push(true); });
    //     } else if (value && !checkedValue && !this.indeterminateCheck && !this.mainCheck) {
    //         this.hideAvatar.splice(idx, 1, true);
    //     } else {
    //         this.hideAvatar = [];
    //         this.list.map(value => { this.hideAvatar.push(false); });
    //     }
    // }

}
