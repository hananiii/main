import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


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
    public matcher = new MyErrorStateMatcher();
    public email: string;
    private _subscription: Subscription = new Subscription();
    private _invitationId: string;
    private _activeUrl: string;


    constructor(private fb: FormBuilder, private apiService: APIService,
        private route: ActivatedRoute) {
        route.queryParams
            .subscribe((params) => {
                this._invitationId = params.token;
                this._subscription = this._subscription = this.apiService.get_invitation(this._invitationId).subscribe(
                    (data: any) => {
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

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    checkPasswords(group: FormGroup) {
        let pass = group.controls.newPass.value;
        let confirmPass = group.controls.confirmPass.value;
        return pass === confirmPass ? null : { notSame: true }
    }

    sendPassword(value) {
        const body = {
            id: this._invitationId,
            password: value.confirmPass
        };

        this._subscription = this.apiService.patch_invitation(body).subscribe((data: any[]) => {
        },
            error => {
                if (error.status === 401) {
                    window.location.href = '/login';
                }
            });
    }


}
