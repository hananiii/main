import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { APIService } from "$admin-root/src/services/shared-service/api.service";

/**
 * API for leave entitlement by batch
 * @export
 * @class LeaveEntitlementByBatchApiService
 */
@Injectable({
    providedIn: 'root'
})
export class LeaveEntitlementByBatchApiService {

    /**
     *Creates an instance of LeaveEntitlementByBatchApiService.
     * @param {APIService} apiService get all API
     * @memberof LeaveEntitlementByBatchApiService
     */
    constructor(public apiService: APIService) {
    }

    /**
     * Get list of leave entitlement for this tenant
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementByBatchApiService
     */
    get_leavetype_entitlement(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/leavetype-entitlement');
    }

    /**
     * Assign leave entitlement to user
     * @param {*} value
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementByBatchApiService
     */
    post_leave_entitlement(value): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(value, '/api/leave-entitlement');
    }

    /**
     * return user list from API service
     * @returns
     * @memberof LeaveEntitlementByBatchApiService
     */
    get_user_list() {
        return this.apiService.get_user_profile_list();
    }
}