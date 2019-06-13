import { Component, OnInit } from '@angular/core';
/**
 * Dashboard Page
 * @export
 * @class DashboardPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
    /**
     * This is local property of button outline style 
     * @type {string}
     * @memberof DashboardPage
     */
    public buttonOneFill: string = 'outline';

    /**
     * This is local property of button outline style
     * @type {string}
     * @memberof DashboardPage
     */
    public buttonTwoFill: string = 'clear';

    /**
     * This is local property of button outline style
     * @type {string}
     * @memberof DashboardPage
     */
    public buttonThreeFill: string = 'clear';

    /**
     * This is local property of show all updates content
     * @type {boolean}
     * @memberof DashboardPage
     */
    public showAllUpdates: boolean = true;

    /**
     * This is local property of show my recent content
     * @type {boolean}
     * @memberof DashboardPage
     */
    public showMyRecent: boolean = false;

    /**
     * This is local property of show announcement content
     * @type {boolean}
     * @memberof DashboardPage
     */
    public showAnnouncement: boolean = false;

    /**
     * This is local property of show icon of red dot
     * @type {boolean}
     * @memberof DashboardPage
     */
    public showDot: boolean = true;

    /**
     * This is local property to expand content
     * @type {boolean}
     * @memberof DashboardPage
     */
    public showViewMore: boolean = true;

    /**
     * This is local property to collapse content
     * @type {boolean}
     * @memberof DashboardPage
     */
    public showViewLess: boolean = false;

    /**
     * This is local property to expand who is onleave content
     * @type {boolean}
     * @memberof DashboardPage
     */
    public seeAll: boolean = true;

    /**
     * This is local property to collapse who is onleave content
     * @type {boolean}
     * @memberof DashboardPage
     */
    public seeLess: boolean = false;

    /**
     * This is local property to determine click on expand view more or vice versa
     * @type {boolean}
     * @memberof DashboardPage
     */
    public clickOnViewMore: boolean;

    /**
     * This is local property to determine click on expand see all or vice versa
     * @type {boolean}
     * @memberof DashboardPage
     */
    public clickOnSeeAll: boolean;

    /**
     *Creates an instance of DashboardPage.
     * @memberof DashboardPage
     */
    constructor() { }

    /**
     * Initial method
     * @memberof DashboardPage
     */
    ngOnInit() {
    }

    /**
     * This method is used to determine the button click and button style
     * @param {number} value
     * @memberof DashboardPage
     */
    buttonClick(value: number) {
        if (value === 1) {
            this.buttonOneFill = 'outline';
            this.buttonTwoFill = 'clear';
            this.buttonThreeFill = 'clear';
            this.showAllUpdates = true;
            this.showMyRecent = false;
            this.showAnnouncement = false;
        } else if (value === 2) {
            this.buttonOneFill = 'clear';
            this.buttonTwoFill = 'outline';
            this.buttonThreeFill = 'clear';
            this.showAllUpdates = false;
            this.showMyRecent = true;
            this.showAnnouncement = false;
        } else {
            this.buttonOneFill = 'clear';
            this.buttonTwoFill = 'clear';
            this.buttonThreeFill = 'outline';
            this.showAllUpdates = false;
            this.showMyRecent = false;
            this.showAnnouncement = true;
            this.showDot = false;
        }
    }

}