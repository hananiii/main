import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';

/**
 * Employee List Page
 * @export
 * @class EmployeeListPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-employee-list',
    templateUrl: './employee-list.page.html',
    styleUrls: ['./employee-list.page.scss'],
})
export class EmployeeListPage implements OnInit {

    /**
     * This local property is used to get user profile list from API
     * @type {*}
     * @memberof EmployeeListPage
     */
    public items: any;

    /**
     * This local property is used to get department list from API
     * @type {*}
     * @memberof EmployeeListPage
     */
    public departmentList: any;

    /**
     * This local property is used to show types of arrow icon for name column
     * @type {boolean}
     * @memberof EmployeeListPage
     */
    public arrowDownName: boolean = true;

    /**
     * This local property is used to show types of arrow icon for ID column
     * @type {boolean}
     * @memberof EmployeeListPage
     */
    public arrowDownId: boolean = true;

    /**
     * This local property is used to get total number of user profile list
     * @type {number}
     * @memberof EmployeeListPage
     */
    public totalItem: number;

    /**
     * This local property is used to set page items
     * @type {number}
     * @memberof EmployeeListPage
     */
    public pageItems: number = 6;

    /**
     * This local property is used to set range for calculation
     * @type {number}
     * @memberof EmployeeListPage
     */
    public range: number = 5;

    /**
     * This local property is used to calculate page number
     * @type {number}
     * @memberof EmployeeListPage
     */
    public pageNum: number;

    /** 
     * This local property is used to calculate total page number
     * @type {number}
     * @memberof EmployeeListPage
     */
    public totalPageNum: number;

    /**
     * This local property is used to show current page content items
     * @type {*}
     * @memberof EmployeeListPage
     */
    public currentPageItems: any;

    /**
     * This local property is used to enable or disable next button
     * @type {boolean}
     * @memberof EmployeeListPage
     */
    public disableNextButton: boolean;

    /**
     * This local property is used to enable or disable previous button
     * @type {boolean}
     * @memberof EmployeeListPage
     */
    public disablePrevButton: boolean = true;

    /**
     * This local property is used to show list view
     * @type {boolean}
     * @memberof EmployeeListPage
     */
    public listView: boolean = true;

    /**
     * This local property is used to show grid view
     * @type {boolean}
     * @memberof EmployeeListPage
     */
    public gridView: boolean = false;

    /**
     * This local property is used to save favourite name card
     * @memberof EmployeeListPage
     */
    public setAsFavourite = [];

    /**
     * This local property is used to show filter details
     * @type {boolean}
     * @memberof EmployeeListPage
     */
    public viewMoreFilter: boolean = false;

    /**
     * This local property is used to show header of advertisement message
     * @type {boolean}
     * @memberof EmployeeListPage
     */
    public showHeader: boolean = true;

    /**
     * This local property is used to show loading spinner
     * @type {boolean}
     * @memberof EmployeeListPage
     */
    public showSpinner: boolean = true;

    public showContent: boolean = false;

    foods = [
        { value: 'steak-0', viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'tacos-2', viewValue: 'Tacos' }
    ];

    /**
     * return current page users
     * @readonly
     * @memberof EmployeeListPage
     */
    public get personalList() {
        return this.currentPageItems;
    }

    /**
     *Creates an instance of EmployeeListPage.
     * @param {APIService} apiService
     * @param {ActivatedRoute} route
     * @param {ElementRef} elRef
     * @param {Renderer} renderer
     * @param {Router} router
     * @memberof EmployeeListPage
     */
    constructor(private apiService: APIService, public router: Router) { }

    /**
     * Inital method
     * Get user profile list from API
     * Get department list from API
     * @memberof EmployeeListPage
     */
    ngOnInit() {
        this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.items = data;
                this.pageNum = 1;
                this.renderItems(this.pageNum, this.items, this.pageItems, this.range);
                this.showSpinner = false;
                this.showContent = true;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
        this.apiService.get_master_list('department').subscribe((data) => {
            this.departmentList = data;
        });
    }

    /**
     * This method is used to show view list or grid list items
     * @param {boolean} showList
     * @param {number} pageItem
     * @param {number} range
     * @memberof EmployeeListPage
     */
    viewList(showList: boolean, pageItem: number, range: number) {
        this.listView = showList;
        this.gridView = !showList;
        this.disableNextButton = false;
        this.disablePrevButton = true;
        this.pageItems = pageItem;
        this.range = range;
        this.renderItems(1, this.items, this.pageItems, this.range);
    }

    /**
     * This method is used to calculate content of items in a page
     * @param {number} i
     * @param {*} data
     * @param {number} pageIndex
     * @param {number} rangeNumber
     * @memberof EmployeeListPage
     */
    renderItems(i: number, data: any, pageIndex: number, rangeNumber: number) {
        this.pageNum = i;
        this.totalItem = this.items.length;
        this.totalPageNum = this.totalItem / pageIndex;
        this.totalPageNum = Math.ceil(this.totalPageNum);
        const firstNum = (this.pageNum * pageIndex) - rangeNumber;
        const lastNum = this.pageNum * pageIndex;
        const currentPageList = [];
        for (let j = firstNum - 1; j < lastNum; j++) {
            const itemValue = data[j];
            if (itemValue !== undefined) {
                currentPageList.push(itemValue);
            }
        }
        this.currentPageItems = currentPageList;
        this.showSpinner = false;
        this.showContent = true;
    }

    /**
     * This method is used to disable or enable next button
     * @memberof EmployeeListPage
     */
    disableEnableNextButton() {
        if (this.pageNum > 0 && this.pageNum < this.totalPageNum) {
            this.disableNextButton = false;
        }
        if (this.pageNum === this.totalPageNum) {
            this.disableNextButton = true;
        }
        if (this.pageNum > 1) {
            this.disablePrevButton = false;
        }
    }

    /**
     * This method is used to disable or enable previous button
     * @memberof EmployeeListPage
     */
    disableEnablePreviousButton() {
        if (this.pageNum > 1 && this.pageNum === this.totalPageNum) {
            this.disablePrevButton = false;
        }
        if (this.pageNum < 2) {
            this.disablePrevButton = true;
        }
        if (this.pageNum < this.totalPageNum) {
            this.disableNextButton = false;
        }
    }

    /**
     * This method is used to show page content when clicked on next or previous button
     * @param {number} index
     * @param {string} nextOrPrev
     * @memberof EmployeeListPage
     */
    clickPageButton(index: number, nextOrPrev: string) {
        if (!(index > this.totalPageNum) && nextOrPrev === 'next') {
            this.showSpinner = true;
            this.renderItems(index, this.items, this.pageItems, this.range);
            this.disableEnableNextButton();
        }
        if (!(index < 1) && nextOrPrev === 'prev') {
            this.showSpinner = true;
            this.renderItems(index, this.items, this.pageItems, this.range);
            this.disableEnablePreviousButton();
        }
    }

    /**
     * This method is used to sort name column
     * @param {boolean} value
     * @param {number} checkAsc
     * @param {number} checkDes
     * @memberof EmployeeListPage
     */
    nameSorting(value: boolean, checkAsc: number, checkDes: number) {
        this.showSpinner = true;
        this.arrowDownName = value;
        this.items = this.items.slice(0);
        this.items.sort(function (a: any, b: any) {
            const x = a.employeeName.toUpperCase();
            const y = b.employeeName.toUpperCase();
            return x < y ? checkAsc : x > y ? checkDes : 0;
        });
        this.renderItems(1, this.items, this.pageItems, this.range);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    /**
     * This method is used to sort ID column
     * @param {boolean} value
     * @param {number} ascValue
     * @param {number} desValue
     * @memberof EmployeeListPage
     */
    IDSorting(value: boolean, ascValue: number, desValue: number) {
        this.showSpinner = true;
        this.arrowDownId = value;
        this.items = this.items.slice(0);
        this.items.sort(function (x, y) {
            const a = x.staffNumber;
            const b = y.staffNumber;
            return a < b ? ascValue : a > b ? desValue : 0;
        });
        this.renderItems(1, this.items, this.pageItems, this.range);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    /**
     * This method is used to filter employee name
     * @param {*} char
     * @memberof EmployeeListPage
     */
    filterDetails(char: any) {
        if (char && char.trim() != '') {
            this.items = this.items.filter((data: any) => {
                return (data.employeeName.toUpperCase().indexOf(char.toUpperCase()) > -1);
            })
            this.pageNum = 1;
            this.renderItems(this.pageNum, this.items, this.pageItems, this.range);
            this.disableEnableNextButton();
            this.disableEnablePreviousButton();
        }
    }

    /**
     * This method is used to get content after clear value from search bar
     * @memberof EmployeeListPage
     */
    clearDetails() {
        this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.items = data;
                this.pageNum = 1;
                this.renderItems(this.pageNum, this.items, this.pageItems, this.range);
            }
        );
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    /**
     * This method is used to determine the filter content when change occured
     * @param {*} text
     * @memberof EmployeeListPage
     */
    changeDetails(text: any) {
        this.showSpinner = true;
        if (text.srcElement.value === '') {
            this.clearDetails();
        } else {
            this.filterDetails(text.srcElement.value);
        }
    }

    /**
     * This method is used to check user ID exist or not
     * @param {string} ID
     * @returns
     * @memberof EmployeeListPage
     */
    userIDExists(ID: string) {
        return this.setAsFavourite.some(function (el) {
            return el.itemId === ID;
        });
    }

    /**
     * This method is used to save name card as favourite list when clicked on star icon
     * @param {number} index
     * @param {*} item
     * @memberof EmployeeListPage
     */
    clickAsFavourite(index: number, item: any) {
        const obj = { index: index, itemId: item.id };
        const data = obj;
        if (!this.userIDExists(item.id) && this.setAsFavourite.length > 0) {
            this.setAsFavourite.push(data);
        } else if (this.userIDExists(item.id) && this.setAsFavourite.length > 0) {
            for (let i = 0; i < this.setAsFavourite.length; i++) {
                if (this.setAsFavourite[i].itemId == item.id && this.setAsFavourite[i].index == index) {
                    this.setAsFavourite.splice(i, 1);
                }
            }
        } else {
            this.setAsFavourite.push(data);
        }
    };

}
