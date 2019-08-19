import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LeaveAPIService } from "../leave-api.service";
import { APIService } from "src/services/shared-service/api.service";
import { MatSnackBar } from "@angular/material";
import { SnackbarNotificationPage } from "../snackbar-notification/snackbar-notification";
/**
 * leave adjusment page
 * @export
 * @class LeaveAdjustmentPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-leave-adjustment',
    templateUrl: './leave-adjustment.page.html',
    styleUrls: ['./leave-adjustment.page.scss'],
})
export class LeaveAdjustmentPage implements OnInit {

    /**
     * validation group 
     * @type {*}
     * @memberof LeaveAdjustmentPage
     */
    public adjustmentForm: any;

    /**
     * company list from API
     * @type {*}
     * @memberof LeaveAdjustmentPage
     */
    public company: any;

    /**
     * department list from API
     * @type {*}
     * @memberof LeaveAdjustmentPage
     */
    public department: any;

    /**
     * leavetype list from API
     * @type {*}
     * @memberof LeaveAdjustmentPage
     */
    public leavetypeList: any;

    /**
     * filter users from selected company and department
     * @type {any[]}
     * @memberof LeaveAdjustmentPage
     */
    public filteredUserItems: any[] = [];


    /**
     * enable/disable submit button according required item
     * @type {boolean}
     * @memberof LeaveAdjustmentPage
     */
    public disableSubmitButton: boolean = true;

    /**
     * value of main checkbox
     * @type {boolean}
     * @memberof LeaveAdjustmentPage
     */
    public mainCheckBox: boolean;

    /**
     * value of indeterminate in main checkbox
     * @type {boolean}
     * @memberof LeaveAdjustmentPage
     */
    public indeterminate: boolean;

    /**
     * hover value of show/hide checkbox
     * @type {boolean}
     * @memberof LeaveAdjustmentPage
     */
    public showCheckbox: boolean = false;

    /**
     * show/hide spinner when submit button is clicked
     * @type {boolean}
     * @memberof LeaveAdjustmentPage
     */
    public showSmallSpinner: boolean = false;

    /**
     * show/hide spinner when company & department selection is clicked
     * @type {boolean}
     * @memberof LeaveAdjustmentPage
     */
    public showSpinner: boolean = false;

    /**
     * selected company guid
     * @private
     * @type {string}
     * @memberof LeaveAdjustmentPage
     */
    private _companyGUID: string;

    /**
     * user list from API
     * @private
     * @type {*}
     * @memberof LeaveAdjustmentPage
     */
    private _userItems: any;

    /**
     * selected user details from user list
     * @private
     * @type {any[]}
     * @memberof LeaveAdjustmentPage
     */
    private _selectedUser: any[] = [];

    /**
     *Creates an instance of LeaveAdjustmentPage.
     * @param {LeaveAPIService} leaveSetupAPI
     * @param {APIService} apiService
     * @param {MatSnackBar} snackBar
     * @memberof LeaveAdjustmentPage
     */
    constructor(private leaveSetupAPI: LeaveAPIService, private apiService: APIService, private snackBar: MatSnackBar) {
        this.adjustmentForm = new FormGroup({
            company: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required),
            leavetype: new FormControl('', Validators.required),
            reason: new FormControl('', Validators.required),
            noOfDay: new FormControl('', Validators.required)
        })
    }

    ngOnInit() {
        this.apiService.get_company_list().subscribe(list => this.company = list);
        this.leaveSetupAPI.get_admin_leavetype().subscribe(list => this.leavetypeList = list);
    }

    /**
     * select company & pass company guid to get department list
     * @param {*} guid
     * @memberof LeaveAdjustmentPage
     */
    companySelected(guid) {
        this.showSpinner = true;
        this._companyGUID = guid;
        this.leaveSetupAPI.get_company_details(guid).subscribe(list => {
            this.showSpinner = false;
            this.department = list.departmentList;
        })
    }

    /**
     * get user list from API
     * @param {*} name
     * @memberof LeaveAdjustmentPage
     */
    departmentSelected(name) {
        this.filteredUserItems = [];
        this.showSpinner = true;
        this.apiService.get_user_profile_list().subscribe(list => {
            this._userItems = list;
            this.showSpinner = false;
            this.filterUserList(this._userItems, name);
        })
    }

    /**
     * get user list to filter from selected compant & department
     * @param {*} userList
     * @param {string} name
     * @memberof LeaveAdjustmentPage
     */
    filterUserList(userList: any, name: string) {
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].department === name && userList[i].companyId === this._companyGUID) {
                this.filteredUserItems.push(userList[i]);
                this.filteredUserItems[this.filteredUserItems.length - 1].isChecked = false;
            }
        }
    }

    /**
     * checking to enable/disable submit button
     * @memberof LeaveAdjustmentPage
     */
    enableDisableSubmitButton() {
        if (this.adjustmentForm.valid && (this.mainCheckBox || this.indeterminate)) {
            this.disableSubmitButton = false;
        } else {
            this.disableSubmitButton = true;
        }
    }

    /**
     * mouse hover to show/hide checkbox
     * @param {boolean} mouseIn
     * @param {boolean} isChecked
     * @memberof LeaveAdjustmentPage
     */
    hoverEvent(mouseIn: boolean, isChecked: boolean) {
        if (isChecked && (this.mainCheckBox || this.indeterminate)) {
            this.showCheckbox = true;
        } else if (!isChecked && (this.mainCheckBox || this.indeterminate)) {
            this.showCheckbox = true;
        } else if (mouseIn && !isChecked && !this.indeterminate && !this.mainCheckBox) {
            this.showCheckbox = true;
        } else {
            this.showCheckbox = false;
        }
    }

    /**
     * check main checkbox to check all sub checkbox
     * @memberof LeaveAdjustmentPage
     */
    mainCheckboxEvent() {
        setTimeout(() => {
            this.filteredUserItems.forEach(item => {
                item.isChecked = this.mainCheckBox;
                if (item.isChecked) {
                    this.showCheckbox = true;
                } else {
                    this.showCheckbox = false;
                }
                this.enableDisableSubmitButton();
            });
        })
    }

    /**
     * check sub checkbox to make changing in main checkbox (interminate/mainCheckBox)
     * @memberof LeaveAdjustmentPage
     */
    subEvent() {
        const totalLength = this.filteredUserItems.length;
        let ischecked = 0;
        this.filteredUserItems.map(item => {
            if (item.isChecked) {
                ischecked++;
            }
        });
        if (ischecked > 0 && ischecked < totalLength) {
            this.indeterminate = true;
            this.mainCheckBox = false;
        } else if (ischecked == totalLength) {
            this.mainCheckBox = true;
            this.indeterminate = false;
        } else {
            this.indeterminate = false;
            this.mainCheckBox = false;
        }
        this.enableDisableSubmitButton();
    }

    /**
     * get selected user from list
     * @memberof LeaveAdjustmentPage
     */
    getCheckedUser() {
        this.filteredUserItems.forEach((element, i) => {
            if (element.isChecked) {
                this._selectedUser.push(this.filteredUserItems[i].userId);
            }
        });
    }

    /**
     * patch the leave adjustment day to API
     * @memberof LeaveAdjustmentPage
     */
    patchLeaveNumber() {
        this.getCheckedUser();
        this.showSmallSpinner = true;
        const data = {
            "leaveTypeId": this.adjustmentForm.controls.leavetype.value,
            "noOfDays": Number(this.adjustmentForm.controls.noOfDay.value),
            "userId": this._selectedUser,
            "reason": this.adjustmentForm.controls.reason.value
        };
        this.leaveSetupAPI.patch_leave_adjustment(data).subscribe(response => {
            this.openNotification('submitted successfully ');
            this.showSmallSpinner = false;
            this.filteredUserItems = [];
            this.filteredUserItems.forEach(element => {
                element.isChecked = false;
            });
        });
    }

    /**
     * show pop up snackbar
     * @param {string} statement
     * @memberof LeaveAdjustmentPage
     */
    openNotification(statement: string) {
        this.snackBar.openFromComponent(SnackbarNotificationPage, {
            duration: 5000,
            data: statement
        });
    }



}