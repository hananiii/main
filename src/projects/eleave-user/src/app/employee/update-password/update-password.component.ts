import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { UpdatePasswordApiService } from './update-password-api.service';

/**
 * Check error or validation
 * @export
 * @class MyErrorStateMatcher
 * @implements {ErrorStateMatcher}
 */
export class MyErrorStateMatcher implements ErrorStateMatcher {

    /**
     * Error when invalid control is dirty, touched, or submitted
     * @param {(FormControl | null)} control
     * @param {(FormGroupDirective | NgForm | null)} form
     * @returns {boolean}
     * @memberof MyErrorStateMatcher
     */
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
        const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
        return (invalidCtrl || invalidParent);
    }
}
/**
 * Update password after invited from Admin
 * @export
 * @class UpdatePasswordComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-update-password',
    templateUrl: './update-password.component.html',
    styleUrls: ['./update-password.component.scss'],
})
export class UpdatePasswordComponent implements OnInit {

    /**
     * show/hide password value 
     * @type {boolean}
     * @memberof UpdatePasswordComponent
     */
    public showNewPassword: boolean = false;

    /**
     * show/hide confirm password value 
     * @type {boolean}
     * @memberof UpdatePasswordComponent
     */
    public showConfirmPassword: boolean = false;

    /**
     * Validation or form control for password matcher
     * @type {*}
     * @memberof UpdatePasswordComponent
     */
    public formPassValidation: any;

    /**
     * Check password matcher for new password & confirm password
     * @memberof UpdatePasswordComponent
     */
    public matcher = new MyErrorStateMatcher();

    /**
     * Name value get from API to show on page
     * @type {string}
     * @memberof UpdatePasswordComponent
     */
    public name: string;

    /**
     * Email value get from API to show on page
     * @type {string}
     * @memberof UpdatePasswordComponent
     */
    public email: string;

    /**
     * Invitation Id get from activated route
     * @private
     * @type {string}
     * @memberof UpdatePasswordComponent
     */
    private _invitationId: string;

    /**
     *Creates an instance of UpdatePasswordComponent.
     * @param {FormBuilder} fb
     * @param {UpdatePasswordApiService} updatePassAPI
     * @param {ActivatedRoute} route
     * @memberof UpdatePasswordComponent
     */
    constructor(private fb: FormBuilder, private updatePassAPI: UpdatePasswordApiService,
        private route: ActivatedRoute) {
        route.queryParams
            .subscribe((params) => {
                this._invitationId = params.token;
                this.updatePassAPI.get_invitation(this._invitationId).subscribe(
                    (data: any) => {
                        this.name = data.name;
                        this.email = data.email;
                    }
                );
            });

        this.formPassValidation = this.fb.group({
            newPass: ['', [Validators.required]],
            confirmPass: ['']
        }, { validator: this.checkPasswords })
    }


    ngOnInit() {
    }

    /**
     * check value of new password & confirm password
     * @param {FormGroup} group
     * @returns
     * @memberof UpdatePasswordComponent
     */
    checkPasswords(group: FormGroup) {
        let pass = group.controls.newPass.value;
        let confirmPass = group.controls.confirmPass.value;
        return pass === confirmPass ? null : { notSame: true }
    }

    /**
     * Update password send to endpoint 
     * @param {*} value
     * @memberof UpdatePasswordComponent
     */
    sendPassword(value) {
        const body = {
            id: this._invitationId,
            password: value.confirmPass
        };

        this.updatePassAPI.patch_invitation(body).subscribe((data: any[]) => {
        },
            error => {
                if (error.status === 401) {
                    window.location.href = '/login';
                }
            });
    }


}
