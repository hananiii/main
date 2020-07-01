import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LocalStorageService } from 'angular-web-storage';
import { environment } from '$admin-root/src/environments/environment';

/**
 * API used in this admin folder 
 * @export
 * @class APIService
 */
@Injectable({
    providedIn: 'root'
})
export class APIService {
    /**
     * Save headers for authorization token used
     * @memberof APIService
     */
    public headers = new Headers();

    /**
     * Base URL of API 
     * @type {string}
     * @memberof APIService
     */
    public baseUrl: string = environment.API_URL;

    /**
     *Creates an instance of APIService.
     * @param {Http} http perform http request
     * @param {LocalStorageService} local
     * @param {AuthService} auth
     * @memberof APIService
     */
    constructor(public http: Http, private local: LocalStorageService, private auth: AuthService) {
    }

    /**
     * Pass authorize token to header
     * @memberof APIService
     */
    headerAuthorization() {
        if (this.headers["_headers"].size != 1 && this.auth.isAuthenticated) {
            this.headers.append('Authorization', 'JWT ' + JSON.parse(this.local.get('access_token')));
        }
    }

    /**
     * Get endpoint with assign path
     * @param {string} address
     * @returns
     * @memberof APIService
     */
    getApi(address: string) {
        return this.http.get(this.baseUrl + address, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * Get endpoint with assign path & guid
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
     * Update endpoint to given path and body data
     * @param {*} body
     * @param {string} url
     * @returns
     * @memberof APIService
     */
    patchApi(body: any, url: string) {
        return this.http.patch(this.baseUrl + url, body, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * POST endpoint to given path & data
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
     * DELETE endpoint 
     * @param {string} value
     * @param {string} add
     * @returns
     * @memberof APIService
     */
    deleteApi(value: string, add: string) {
        return this.http.delete(this.baseUrl + add + value, { headers: this.headers })
            .pipe(map((res: Response) => res.json()
            ));
    }

    /**
     * Get personal details JSON data from API
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_personal_details(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/api/userprofile/personal-detail');
    }

    /**
     * Get employment details JSON data from API
     * @param {*} userId
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_employment_details(userId): Observable<any> {
        return this.getApiWithId('/api/userprofile/employment-detail/', userId);
    }

    /**
     * Get user profile list JSON data from endpoint
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_user_profile_list(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/api/users/admin');
    }

    /**
     * get user profile list
     * @param {string} userId
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_user_profile_details(userId: string): Observable<any> {
        this.headerAuthorization();
        return this.getApiWithId('/api/userprofile/', userId);
    }

    /**
     * This method is used to get any desired item
     * department, designation, section, branch, bank, costcentre, country
     * @param {*} item
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_master_list(item): Observable<any> {
        this.headerAuthorization();
        return this.getApiWithId('/api/admin/master/', item);
    }

    /**
     * upload file to azure
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof APIService
     */
    post_file(data): Observable<any> {
        this.headerAuthorization();
        return this.postApi(data, '/api/azure/upload');
    }

    /**
     * get profile picture 
     * @param {string} type
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_profile_pic(type: string): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/api/profile-picture/' + type);
    }

    /**
     * post profile picture name
     * @returns {Observable<any>}
     * @memberof APIService
     */
    post_profile_pic(data): Observable<any> {
        this.headerAuthorization();
        return this.postApi(data, '/api/profile-picture');
    }


}

