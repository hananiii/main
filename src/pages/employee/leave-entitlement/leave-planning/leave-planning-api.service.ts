import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIService } from 'src/services/shared-service/api.service';

/**
 * All leave planning API
 * @export
 * @class LeavePlanningAPIService
 */
@Injectable({
    providedIn: 'root'
})
export class LeavePlanningAPIService {

    /**
     *Creates an instance of LeavePlanningAPIService.
     * @param {Http} http
     * @param {APIService} api
     * @memberof LeavePlanningAPIService
     */
    constructor(public http: Http, private api: APIService) {
    }

    /**
     * This method is used to submit leave application information
     * @param {*} leaveData
     * @returns {Observable<any>}
     * @memberof LeavePlanningAPIService
     */
    post_user_apply_leave(leaveData: any): Observable<any> {
        this.api.headerAuthorization();
        return this.http.post(this.api.baseUrl + '/api/leave/apply', leaveData, { headers: this.api.headers })
            .pipe(map((res: Response) => res.json()));
    }

    /**
     * To get personal calendar holiday details
     * @param {string} calendarId
     * @returns {Observable<any>}
     * @memberof LeavePlanningAPIService
     */
    get_personal_holiday_calendar(id): Observable<any> {
        return this.api.getApiWithId('/api/admin/holiday/', id);
    }

    /**
     * get all employee onleave list
     * @returns {Observable<any>}
     * @memberof LeavePlanningAPIService
     */
    get_calendar_onleave_list(value: any): Observable<any> {
        return this.http.get(this.api.baseUrl + '/api/employee/calendar-leave-list', { params: value, headers: this.api.headers })
            .pipe(map((response: Response) => response.json()))
    }
}