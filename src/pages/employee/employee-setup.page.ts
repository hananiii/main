export interface ISubSideMenu {
  /**
   * This is local interface property as title of menu
   * @type {string}
   * @memberof ISubSideMenu
   */
  title: string;

  /**
   * This is local interface property as url of menu
   * @type {string[]}
   * @memberof ISubSideMenu
   */
  url: string[];

  /**
   * This is local interface property as icon name of menu
   * @type {string}
   * @memberof ISubSideMenu
   */
  icon: string;
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { APIService } from 'src/services/shared-service/api.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/**
 * Employee Setup Page
 * @export
 * @class EmployeeSetupPage
 * @implements {OnInit}
 */
@Component({
  selector: 'app-employee-setup',
  templateUrl: './employee-setup.page.html',
  styleUrls: ['./employee-setup.page.scss'],
})
export class EmployeeSetupPage implements OnInit {
  /**
   * This is local property used to get the number of index in array of employee setup page
   * @type {number}
   * @memberof EmployeeSetupPage
   */
  public numOfArray: number;

  /** 
   * This is local property used to get user ID from API
   * @type {string}
   * @memberof EmployeeSetupPage
   */
  public userId: string;

  /**
   * This is local property used to get content from personal details API
   * @type {*}
   * @memberof EmployeeSetupPage
   */
  public list: any;

  /**
   * This is local property used to get url 
   * @type {string}
   * @memberof EmployeeSetupPage
   */
  public url: string;

  /**
   * Thid is local property used to get last segment of url
   * @type {string}
   * @memberof EmployeeSetupPage
   */
  public lastSegment: string;

  /**
   * This is local property used to set menu title, path routing & icon name
   * @type {ISubSideMenu[]}
   * @memberof EmployeeSetupPage
   */
  public employeeSetupPage: ISubSideMenu[] = [
    {
      title: 'Personal Details',
      url: ['/main/employee-setup/personal-details'],
      icon: 'Icon-User.svg',
    },
    {
      title: 'Employment Details',
      url: ['/main/employee-setup/employment-details', this.userId],
      icon: 'Icon-org-profile.svg',
    },
    {
      title: 'Leave Entitlement',
      url: ['/main/employee-setup/leave-entitlement'],
      icon: 'icon_calendar.svg',
    },
    {
      title: 'Awards & Certification',
      url: ['/main/employee-setup/awards-certification'],
      icon: 'Icon-users-roles.svg',
    },
    // {
    //   title: 'My Connections',
    //   url: ['/main/employee-setup/connection'],
    //   icon: 'people',
    // },
    {
      title: 'Account Settings',
      url: ['/main/employee-setup/account'],
      icon: 'icon_setting.svg',
    }
  ];

  /**
   * This is local private property to set subscription
   * @private
   * @type {Subscription}
   * @memberof EmployeeSetupPage
   */
  private subscription: Subscription = new Subscription();

  /**
   * return value from API content 
   * @readonly
   * @memberof EmployeeSetupPage
   */
  get personalList() {
    return this.list;
  }

  /**
   *Creates an instance of EmployeeSetupPage.
   * @param {ActivatedRoute} route
   * @param {APIService} apiService
   * @param {Router} router
   * @memberof EmployeeSetupPage
   */
  constructor(private route: ActivatedRoute, private apiService: APIService,
    private router: Router) {
  }

  /**
   * Initial method
   * Get personal details API content
   * @memberof EmployeeSetupPage
   */
  ngOnInit() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.url = e.urlAfterRedirects;
        this.checkUrl(this.url);
      });

    this.subscription = this.apiService.get_personal_details().subscribe(data => {
      this.userId = data.id;
      this.list = data;
      this.employeeSetupPage[1].url = ['/main/employee-setup/employment-details', this.userId];
    });
    this.checkUrl(this.router.url);
  }

  /**
   * This method is used to destroy subscription
   * @memberof EmployeeSetupPage
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * This method is used to check clicked current url
   * @param {string} url
   * @memberof EmployeeSetupPage
   */
  checkUrl(url: string) {
    const splitUrl = url.split('/');
    this.lastSegment = splitUrl.pop();
    const joinSplitUrl = splitUrl.join('/');
    if (joinSplitUrl === '/main/employee-setup/employment-details') {
      this.getIndexToShowArrow(1);
    } else {
      for (let i = 0; i < this.employeeSetupPage.length; i++) {
        if (this.employeeSetupPage[i].url.includes(url)) {
          this.getIndexToShowArrow(i);
        }
      }
    }
  }

  /**
   * This method is used to get the current url to show arrow icon
   * @param {number} index
   * @memberof EmployeeSetupPage
   */
  getIndexToShowArrow(index: number) {
    this.numOfArray = index;
    if (this.employeeSetupPage[index].url && index !== 1) {
      this.router.navigate(this.employeeSetupPage[index].url);
    } else {
      if (this.userId === undefined) {
        this.employeeSetupPage[1].url = ['/main/employee-setup/employment-details', this.lastSegment];
        this.router.navigate(this.employeeSetupPage[index].url);
      }
      this.router.navigate(this.employeeSetupPage[index].url);
    }
  }

}
