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
 * @class EmployeeSetupComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-employee-setup',
  templateUrl: './employee-setup.component.html',
  styleUrls: ['./employee-setup.component.scss'],
})
export class EmployeeSetupComponent implements OnInit {
  /**
   * This is local property used to get the number of index in array of employee setup page
   * @type {number}
   * @memberof EmployeeSetupComponent
   */
  public numOfArray: number;

  /** 
   * This is local property used to get user ID from API
   * @type {string}
   * @memberof EmployeeSetupComponent
   */
  public userId: string;

  /**
   * This is local property used to get content from personal details API
   * @type {*}
   * @memberof EmployeeSetupComponent
   */
  public list: any;

  /**
   * This is local property used to get url 
   * @type {string}
   * @memberof EmployeeSetupComponent
   */
  public url: string;

  /**
   * Thid is local property used to get last segment of url
   * @type {string}
   * @memberof EmployeeSetupComponent
   */
  public lastSegment: string;

  /**
   * This is local property used to set menu title, path routing & icon name
   * @type {ISubSideMenu[]}
   * @memberof EmployeeSetupComponent
   */
  public EmployeeSetupComponent: ISubSideMenu[] = [
    {
      title: 'Personal Details',
      url: ['/main/employee-setup/personal-details'],
      icon: 'icon_user@3x.png',
    },
    {
      title: 'Employment Details',
      url: ['/main/employee-setup/employment-details', this.userId],
      icon: 'icon_org_profile@3x.png',
    },
    {
      title: 'Leave Entitlement',
      url: ['/main/employee-setup/leave-entitlement'],
      icon: 'icon_calendar@3x.png',
    },
    {
      title: 'Awards & Certification',
      url: ['/main/employee-setup/awards-certification'],
      icon: 'icon_users_roles@3x.png',
    },
    // {
    //   title: 'My Connections',
    //   url: ['/main/employee-setup/connection'],
    //   icon: 'people',
    // },
    {
      title: 'Account Settings',
      url: ['/main/employee-setup/account'],
      icon: 'icon_setting@3x.png',
    }
  ];

  /**
   * This is local private property to set subscription
   * @private
   * @type {Subscription}
   * @memberof EmployeeSetupComponent
   */
  private subscription: Subscription = new Subscription();

  /**
   * return value from API content 
   * @readonly
   * @memberof EmployeeSetupComponent
   */
  get personalList() {
    return this.list;
  }

  /**
   *Creates an instance of EmployeeSetupComponent.
   * @param {ActivatedRoute} route
   * @param {APIService} apiService
   * @param {Router} router
   * @memberof EmployeeSetupComponent
   */
  constructor(private route: ActivatedRoute, private apiService: APIService,
    private router: Router) {
  }

  /**
   * Initial method
   * Get personal details API content
   * @memberof EmployeeSetupComponent
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
      this.EmployeeSetupComponent[1].url = ['/main/employee-setup/employment-details', this.userId];
    });
    this.checkUrl(this.router.url);
  }

  /**
   * This method is used to destroy subscription
   * @memberof EmployeeSetupComponent
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * This method is used to check clicked current url
   * @param {string} url
   * @memberof EmployeeSetupComponent
   */
  checkUrl(url: string) {
    const splitUrl = url.split('/');
    this.lastSegment = splitUrl.pop();
    const joinSplitUrl = splitUrl.join('/');
    if (joinSplitUrl === '/main/employee-setup/employment-details') {
      this.getIndexToShowArrow(1);
    } else {
      for (let i = 0; i < this.EmployeeSetupComponent.length; i++) {
        if (this.EmployeeSetupComponent[i].url.includes(url)) {
          this.getIndexToShowArrow(i);
        }
      }
    }
  }

  /**
   * This method is used to get the current url to show arrow icon
   * @param {number} index
   * @memberof EmployeeSetupComponent
   */
  getIndexToShowArrow(index: number) {
    this.numOfArray = index;
    if (this.EmployeeSetupComponent[index].url && index !== 1) {
      this.router.navigate(this.EmployeeSetupComponent[index].url);
    } else {
      if (this.userId === undefined) {
        this.EmployeeSetupComponent[1].url = ['/main/employee-setup/employment-details', this.lastSegment];
        this.router.navigate(this.EmployeeSetupComponent[index].url);
      }
      this.router.navigate(this.EmployeeSetupComponent[index].url);
    }
  }

}
