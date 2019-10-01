import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/shared-service/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import {  Headers } from '@angular/http';

/**
 * Login component
 * @export
 * @class LoginComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /**
   * This is local property to show password value
   * @type {boolean}
   * @memberof LoginComponent
   */
  public showPassword: boolean = false;

  /**
   * This is local property to determine checkbox is ticked or vice versa
   * @type {boolean}
   * @memberof LoginComponent
   */
  public valueOfCheck: boolean;

  /**
   * This is local property to save email value
   * @type {string}
   * @memberof LoginComponent
   */
  public emailValue: string;

  /**
   * This is local property to save password value
   * @type {string}
   * @memberof LoginComponent
   */
  public passValue: string;

  /**
   * show forgot password page
   * @type {boolean}
   * @memberof LoginComponent
   */
  public forgotPass: boolean = false;

  /**
   * This is local property to form group of validation for email and password
   * @memberof LoginComponent
   */
  public formGroupValidation = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    pass: new FormControl(null, [Validators.required]),
  });

  /**
   * This is local property to form group of validation to reset password
   * @memberof LoginComponent
   */
  public resetPassword = new FormGroup({ emailAdd: new FormControl(null, [Validators.required, Validators.email]) });

  /** 
   * header for the request API
   * @memberof LoginComponent
   */
  public headers = new Headers();

  /**
   * loading spinner to send request to email
   * @type {boolean}
   * @memberof LoginComponent
   */
  public showSmallSpinner: boolean = false;

  /**
   * This method is used to show error message when the form control of email is invalid
   * @returns
   * @memberof LoginComponent
   */
  getErrorMessage() {
    return this.formGroupValidation.controls['email'].hasError('required') ? 'Please enter username' :
      this.formGroupValidation.controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

  /**
   * get validation of enter email
   * @returns
   * @memberof LoginComponent
   */
  getEmailError() {
    return this.resetPassword.controls['emailAdd'].hasError('required') ? 'Please enter email' :
      this.resetPassword.controls['emailAdd'].hasError('email') ? 'Not a valid email address' : '';
  }

  /**
   * This method is used to show error message when the form control of password is invalid
   * @returns
   * @memberof LoginComponent
   */
  getPassErrorMessage() {
    return this.formGroupValidation.controls['pass'].hasError('required') ? 'Please enter password' : '';
  }

  /**
   *Creates an instance of LoginComponent.
   * @param {AuthService} _auth
   * @param {Router} router
   * @memberof LoginComponent
   */
  constructor(private _auth: AuthService, private router: Router, private spinner: NgxSpinnerService,
  ) { }

  /**
   * This method is used to get initial value of email and password
   * @memberof LoginComponent
   */
  ngOnInit() {
    if ((localStorage.getItem('user_email') !== null) && (localStorage.getItem('user_pass') !== null)) {
      this.valueOfCheck = true;
      this.emailValue = localStorage.getItem('user_email');
      this.passValue = localStorage.getItem('user_pass');
      this.formGroupValidation.get('email').setValue(this.emailValue);
      this.formGroupValidation.get('pass').setValue(this.passValue);
    }
    this._auth.logout();
  }

  /**
   * This method is used to show password value when clicked the close eye icon
   * @memberof LoginComponent
   */
  showPasswordKey() {
    this.showPassword = true;
  }
  /**
   * This method is used to hide password value when clicked the open eye icon
   * @memberof LoginComponent
   */
  hidePasswordKey() {
    this.showPassword = false;
  }

  /**
   * This method is used to route to main page when clicked log in button
   * @param {string} email
   * @param {string} pass
   * @memberof LoginComponent
   */
  signIn(email: string, pass: string) {
    this.spinner.show();
    this._auth.login(email, pass)
      .subscribe(data => {
        console.log(data);
        this.router.navigate(['main'])
        this.spinner.hide();
      }
      );
  }

  /**
   * send email to resert password
   * @param {string} email
   * @memberof LoginComponent
   */
  sendRequest(email: string) {
    this.showSmallSpinner = true;
    return this._auth.http.post(this._auth.baseUrl + '/api/forgot-password/' + email, { headers: this.headers })
      .subscribe((res) => {
        if (res.status === 200) {
          this.showSmallSpinner = false;
          this.forgotPass = false;
          this.resetPassword.reset();
        }
      })
  }

  /**
   * This method is used to save user email & password 
   * @param {*} event
   * @param {string} email
   * @param {string} pass
   * @memberof LoginComponent
   */
  rememberMe(event: any, email: string, pass: string) {
    if (email !== "" || pass !== "") {
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_pass', pass);
    }
    if (event.detail.checked === false) {
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_pass');
    }
  }

}
