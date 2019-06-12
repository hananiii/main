import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/shared-service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public showPassword: boolean = false;
  public valueOfCheck: boolean;
  public emailValue: string;
  public passValue: string;
  public formGroupValidation = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    pass: new FormControl(null, [Validators.required]),
  });

  /**
   * This method is used to show error message when the form control of email is invalid
   * @returns
   * @memberof LoginComponent
   */
  getErrorMessage() {
    return this.formGroupValidation.controls['email'].hasError('required') ? 'Please enter your email address' :
      this.formGroupValidation.controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

  /**
   * This method is used to show error message when the form control of password is invalid
   * @returns
   * @memberof LoginComponent
   */
  getPassErrorMessage() {
    return this.formGroupValidation.controls['pass'].hasError('required') ? 'Please enter your password' : '';
  }

  constructor(private _auth: AuthService,
    private router: Router) { }

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
    this._auth.login(email, pass)
      .subscribe(data => {
        console.log(data);
        this.router.navigate(['main'])
      }
      );
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
