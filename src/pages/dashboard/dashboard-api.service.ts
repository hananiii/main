import { Injectable } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

/**
 * ALl API for dashboard page
 * @export
 * @class DashboardAPIService
 */
@Injectable({
    providedIn: 'root'
})
export class DashboardAPIService {

    /**
     *Creates an instance of DashboardAPIService.
     * @param {APIService} apiService
     * @param {Http} http
     * @memberof DashboardAPIService
     */
    constructor(private apiService: APIService, public http: Http) {
    }

    /**
     * To get employee onleave status
     * Number of total employee
     * Number of employee onleave
     * @param {*} param
     * @returns {Observable<any>}
     * @memberof DashboardAPIService
     */
    get_status_onleave(param): Observable<any> {
        this.apiService.headerAuthorization();
        return this.http.get(this.apiService.baseUrl + '/api/employee/status-onleave', { params: param, headers: this.apiService.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * To get employee onleave details
     * Name of employee 
     * Designation of employee
     * @param {*} value
     * @returns {Observable<any>}
     * @memberof DashboardAPIService
     */
    get_onleave_list(value): Observable<any> {
        this.apiService.headerAuthorization();
        return this.http.get(this.apiService.baseUrl + '/api/employee/leave-list', { params: value, headers: this.apiService.headers })
            .pipe(map((response: Response) => response.json()))
    }

    /**
     * To get notification message, category
     * @returns {Observable<any>}
     * @memberof DashboardAPIService
     */
    get_news_notification(): Observable<any> {
        return this.apiService.getApi('/api/admin/notification');
    }

    /**
     * get all announcement created from admin
     * @returns
     * @memberof DashboardAPIService
     */
    get_announcement_list() {
        return this.apiService.getApi('/api/admin/announcement');
    }

    /**
     * get upcoming holidays from today date
     * @returns {Observable<any>}
     * @memberof DashboardAPIService
     */
    get_upcoming_holidays(): Observable<any> {
        return this.apiService.getApi('/api/employee/upcoming-holiday');
    }

    /**
     * get details of birthday
     * @returns {Observable<any>}
     * @memberof DashboardAPIService
     */
    get_birthday_details(): Observable<any> {
        return this.apiService.getApi('/api/employee/date-of-birth');
    }



}