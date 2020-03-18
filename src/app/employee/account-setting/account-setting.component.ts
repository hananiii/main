import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { AccountSettingAPIService } from './account-setting-api.service';

/**
 * Account Setting Page
 * @export
 * @class AccountSettingComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-account-setting',
    templateUrl: './account-setting.component.html',
    styleUrls: ['./account-setting.component.scss'],
})
export class AccountSettingComponent implements OnInit {

    /**
     * url of profile picture
     * @type {string}
     * @memberof AccountSettingComponent
     */
    public url: string;

    /**
     * get user data
     * @private
     * @type {*}
     * @memberof AccountSettingComponent
     */
    private userData: any;

    /**
     *Creates an instance of AccountSettingComponent.
     * @param {APIService} api
     * @param {AccountSettingAPIService} accountApi
     * @memberof AccountSettingComponent
     */
    constructor(private api: APIService, private accountApi: AccountSettingAPIService) {
        this.api.get_profile_pic('personal').subscribe(data => {
            this.url = data;
        })
    }

    /**
     * Initial method
     * @memberof AccountSettingComponent
     */
    ngOnInit() {
        this.api.get_user_profile().subscribe(data => this.userData = data)
    }

    /**
     * change profile picture 
     * @param {*} file
     * @memberof AccountSettingComponent
     */
    submitProfilePic(file: any) {
        const fileToUpload = file.item(0);
        let formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        this.api.post_file(formData).subscribe(res => {
            const data = { "userGuid": this.userData.userId, "profilePictureFile": res.filename };
            this.accountApi.post_profile_pic(data).subscribe(response => {
                this.api.get_profile_pic('personal').subscribe(data => {
                    this.url = data;
                })
            })
        });
    }
}