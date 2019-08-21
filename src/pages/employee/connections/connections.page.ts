import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Connections Page
 * @export
 * @class ConnectionsPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-connections',
    templateUrl: './connections.page.html',
    styleUrls: ['./connections.page.scss'],
})
export class ConnectionsPage implements OnInit {

    /**
     * This local property is used to get user profile list from API
     * @type {*}
     * @memberof ConnectionsPage
     */
    public items: any;

    /**
     * This local property is used to get department list from API
     * @type {*}
     * @memberof ConnectionsPage
     */
    public departmentList: any;

    /**
     * This local property is used to show types of arrow icon for name column
     * @type {boolean}
     * @memberof ConnectionsPage
     */
    public arrowDownName: boolean = true;

    /**
     * This local property is used to show types of arrow icon for ID column
     * @type {boolean}
     * @memberof ConnectionsPage
     */
    public arrowDownId: boolean = true;

    /**
     * This local property is used to get total number of user profile list
     * @type {number}
     * @memberof ConnectionsPage
     */
    public totalItem: number;

    /**
     * This local property is used to set page items
     * @type {number}
     * @memberof ConnectionsPage
     */
    public pageItems: number = 6;

    /**
     * This local property is used to set range for calculation
     * @type {number}
     * @memberof ConnectionsPage
     */
    public range: number = 5;

    /**
     * This local property is used to calculate page number
     * @type {number}
     * @memberof ConnectionsPage
     */
    public pageNum: number;

    /** 
     * This local property is used to calculate total page number
     * @type {number}
     * @memberof ConnectionsPage
     */
    public totalPageNum: number;

    /**
     * This local property is used to show current page content items
     * @type {*}
     * @memberof ConnectionsPage
     */
    public currentPageItems: any;

    /**
     * This local property is used to enable or disable next button
     * @type {boolean}
     * @memberof ConnectionsPage
     */
    public disableNextButton: boolean;

    /**
     * This local property is used to enable or disable previous button
     * @type {boolean}
     * @memberof ConnectionsPage
     */
    public disablePrevButton: boolean = true;

    /**
     * This local property is used to show list view
     * @type {boolean}
     * @memberof ConnectionsPage
     */
    public listView: boolean = true;

    /**
     * This local property is used to show grid view
     * @type {boolean}
     * @memberof ConnectionsPage
     */
    public gridView: boolean = false;

    /**
     * This local property is used to save favourite name card
     * @memberof ConnectionsPage
     */
    public setAsFavourite = [];

    /**
     * This local property is used to show filter details
     * @type {boolean}
     * @memberof ConnectionsPage
     */
    public viewMoreFilter: boolean = false;

    /**
     * This local property is used to get connection url
     * @type {boolean}
     * @memberof ConnectionsPage
     */
    public connectionRoute: boolean;

    /**
     * This local property is used to show header of advertisement message
     * @type {boolean}
     * @memberof ConnectionsPage
     */
    public showHeader: boolean = true;

    /**
     * This local property is used to show loading spinner
     * @type {boolean}
     * @memberof ConnectionsPage
     */
    public showSpinner: boolean = true;

    /**
     * This local private property is used to set subscription
     * @private
     * @type {Subscription}
     * @memberof ConnectionsPage
     */
    private subscription: Subscription = new Subscription();

    foods = [
        { value: 'steak-0', viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'tacos-2', viewValue: 'Tacos' }
    ];

    public get personalList() {
        return this.currentPageItems;
    }

    /**
     *Creates an instance of ConnectionsPage.
     * @param {APIService} apiService
     * @param {ActivatedRoute} route
     * @param {ElementRef} elRef
     * @param {Renderer} renderer
     * @param {Router} router
     * @memberof ConnectionsPage
     */
    constructor(private apiService: APIService, private route: ActivatedRoute,
        private elRef: ElementRef, private renderer: Renderer, public router: Router) { }

    /**
     * Inital method
     * Get user profile list from API
     * Get department list from API
     * @memberof ConnectionsPage
     */
    ngOnInit() {
        if (this.route.routeConfig.path.includes('connection')) {
            this.connectionRoute = true;
        } else {
            this.renderer.setElementStyle(this.elRef.nativeElement, 'top', '48px');
        }
        this.subscription = this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.items = data;
                this.pageNum = 1;
                this.renderItems(this.pageNum, this.items, this.pageItems, this.range);
                this.showSpinner = false;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );

        this.subscription = this.apiService.get_master_list('department').subscribe((data) => {
            this.departmentList = data;
        });


    }

    /**
     * Destroy subscription
     * @memberof ConnectionsPage
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * This method is used to show view list or grid list items
     * @param {boolean} showList
     * @param {number} pageItem
     * @param {number} range
     * @memberof ConnectionsPage
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
     * @memberof ConnectionsPage
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
    }

    /**
     * This method is used to disable or enable next button
     * @memberof ConnectionsPage
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
     * @memberof ConnectionsPage
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
     * @memberof ConnectionsPage
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
     * @memberof ConnectionsPage
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
     * @memberof ConnectionsPage
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
     * @memberof ConnectionsPage
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
     * @memberof ConnectionsPage
     */
    clearDetails() {
        this.subscription = this.apiService.get_user_profile_list().subscribe(
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
     * @memberof ConnectionsPage
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
     * @memberof ConnectionsPage
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
     * @memberof ConnectionsPage
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
