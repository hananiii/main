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
     * @param {APIService} apiService
     * @memberof LeavePlanningAPIService
     */
    constructor(public http: Http, private apiService: APIService) {
    }

    /**
     * This method is used to submit leave application information
     * @param {*} leaveData
     * @returns {Observable<any>}
     * @memberof LeavePlanningAPIService
     */
    post_user_apply_leave(leaveData: any): Observable<any> {
        this.apiService.headerAuthorization();
        return this.http.post(this.apiService.baseUrl + '/api/leave/apply', leaveData, { headers: this.apiService.headers })
            .pipe(map((res: Response) => res.json()));
    }

    /**
     * To get personal calendar holiday details
     * @param {string} calendarId
     * @returns {Observable<any>}
     * @memberof LeavePlanningAPIService
     */
    get_personal_holiday_calendar(id): Observable<any> {
        return this.apiService.getApiWithId('/api/admin/holiday/', id);
    }
}