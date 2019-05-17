import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';


export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
        const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

        return (invalidCtrl || invalidParent);
    }
}

@Component({
    selector: 'app-update-password',
    templateUrl: './update-password.page.html',
    styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {

    public showNewPassword: boolean = false;
    public showConfirmPassword: boolean = false;

    public formPassValidation: FormGroup;
    matcher = new MyErrorStateMatcher();

    constructor(private fb: FormBuilder) {
        this.formPassValidation = this.fb.group({
            newPass: ['', [Validators.required]],
            confirmPass: ['']
        }, { validator: this.checkPasswords })
    }


    ngOnInit() {
    }

    ngOnDestroy() {
        // this._subscription.unsubscribe();
    }

    checkPasswords(group: FormGroup) {
        let pass = group.controls.newPass.value;
        let confirmPass = group.controls.confirmPass.value;
        return pass === confirmPass ? null : { notSame: true }
    }



}
