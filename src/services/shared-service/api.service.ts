import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Store all API used in employee folder
 * @export
 * @class APIService
 */
@Injectable({
    providedIn: 'root'
})
export class APIService {

    public queryHeaders = new Headers();
    public headers = new Headers();
    // public baseUrl: string = "http://zencore.southeastasia.cloudapp.azure.com:3000";
    public baseUrl: string = "http://zencore.zen.com.my:3000/api";

    /**
     *Creates an instance of APIService.
     * @param {Http} http
     * @memberof APIService
     */
    constructor(public http: Http) {
    }

    /**
     * This method is used to pass authorize token to header
     * @memberof APIService
     */
    headerAuthorization() {
        if (this.headers["_headers"].size != 1) {
            this.headers.append('Authorization', 'JWT ' + JSON.parse(localStorage.getItem('access_token')));
        }
    }

    /**
     * This method is used to get endpoint with specific path
     * @param {string} address
     * @returns
     * @memberof APIService
     */
    getApi(address: string) {
        return this.http.get(this.baseUrl + address, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * This method is used to get endpoint with specific path & guid
     * @param {string} address
     * @param {string} guid
     * @returns
     * @memberof APIService
     */
    getApiWithId(address: string, guid: string) {
        return this.http.get(this.baseUrl + address + guid, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * This method is used to patch endpoint with specific path
     * @param {*} patchData
     * @param {string} url
     * @returns
     * @memberof APIService
     */
    patchApi(patchData: any, url: string) {
        return this.http.patch(this.baseUrl + url, patchData, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * This method is used to post endpoint with specific path and body data
     * @param {*} data
     * @param {string} address
     * @returns
     * @memberof APIService
     */
    postApi(data: any, address: string) {
        return this.http.post(this.baseUrl + address, data, { headers: this.headers })
            .pipe(map((res: Response) => res.json()
            ));
    }

    /**
     * This method is used to get personal details endpoint
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_personal_details(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/userprofile/personal-detail');
    }

    /**
     * This method is used to get personal details endpoint with id of requested user
     * @param {*} guid
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_user_personal_details(guid): Observable<any> {
        return this.getApiWithId('/userprofile/personal-detail/', guid);
    }

    /**
     * This method is used to update personal details
     * @param {*} updateData
     * @returns {Observable<any[]>}
     * @memberof APIService
     */
    patch_personal_details(updateData): Observable<any[]> {
        this.headerAuthorization();
        return this.patchApi(updateData, '/userprofile/personal-detail');
    }

    /**
     * This method is used to get employment details
     * @param {*} userId
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_employment_details(userId): Observable<any> {
        return this.getApiWithId('/userprofile/employment-detail/', userId);
    }

    /**
     * This method is used to update employment details
     * @param {*} updateData
     * @returns {Observable<any>}
     * @memberof APIService
     */
    patch_employment_details(updateData: any): Observable<any> {
        this.headerAuthorization();
        return this.patchApi(updateData, '/userprofile/employment-detail');
    }

    /**
     * This method is used to get user profile information
     * Personal, employment, leave entitlement, education details
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_user_profile(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/userprofile');
    }

    /**
     * This method is used to get all users basic information
     * Id, userId, staffNumber, employeeName, designation, email
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_user_profile_list(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/users');
    }

    /**
     * This method is used to get user profile information of requested GUID
     * @param {*} guid
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_user_profile_details(guid): Observable<any> {
        this.headerAuthorization();
        return this.http.get(this.baseUrl + '/userprofile/' + guid, { headers: this.headers })
            .pipe(map((res: Response) => res.json()));
    }

    /**
     * This method is used to submit leave application information
     * @param {*} leaveData
     * @returns {Observable<any>}
     * @memberof APIService
     */
    post_user_apply_leave(leaveData: any): Observable<any> {
        this.headerAuthorization();
        return this.http.post(this.baseUrl + '/leave/apply', leaveData, { headers: this.headers })
            .pipe(map((res: Response) => res.json()));
    }

    /**
     * This method is used to get all departments name
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_department(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/department');
    }

    /**
     * This method is used to update password for first time
     * @param {*} password
     * @returns {Observable<any>}
     * @memberof APIService
     */
    patch_invitation(password): Observable<any> {
        this.headerAuthorization();
        return this.patchApi(password, '/invitation');
    }

    /**
     * This method is used to accept invitation sent by admin
     * @param {*} token
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_invitation(token): Observable<any> {
        return this.getApiWithId('/invitation/', token);
    }

}
