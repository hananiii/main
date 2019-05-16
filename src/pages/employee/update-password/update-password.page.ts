import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-update-password',
    templateUrl: './update-password.page.html',
    styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {

    public showNewPassword: boolean = false;
    public showConfirmPassword: boolean = false;

    public formPassValidation = new FormGroup({
        newPass: new FormControl(null, [Validators.required]),
        confirmPass: new FormControl(null, [Validators.required]),
    });

    constructor() {
    }


    ngOnInit() {
    }

    ngOnDestroy() {
        // this._subscription.unsubscribe();
    }

    getErrorMessage() {
        return this.formPassValidation.controls['confirmPass'].hasError('required') ? 'Please enter your password' : '';
    }

}
