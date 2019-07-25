import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { APIService } from 'src/services/shared-service/api.service';

/**
 * All update password API
 * @export
 * @class UpdatePasswordAPIService
 */
@Injectable({
    providedIn: 'root'
})
export class UpdatePasswordAPIService {

    /**
     *Creates an instance of UpdatePasswordAPIService.
     * @param {Http} http
     * @param {APIService} apiService
     * @memberof UpdatePasswordAPIService
     */
    constructor(public http: Http, private apiService: APIService) {
    }

    /**
     * This method is used to update password for first time
     * @param {*} password
     * @returns {Observable<any>}
     * @memberof UpdatePasswordAPIService
     */
    patch_invitation(password): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(password, '/api/invitation');
    }

    /**
     * This method is used to accept invitation sent by admin
     * @param {*} token
     * @returns {Observable<any>}
     * @memberof UpdatePasswordAPIService
     */
    get_invitation(token): Observable<any> {
        return this.apiService.getApiWithId('/api/invitation/', token);
    }
}