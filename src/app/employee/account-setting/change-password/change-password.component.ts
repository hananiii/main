import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

/**
 * change password dialog component
 * @export
 * @class ChangePasswordComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  /**
   * current password form name
   * @type {*}
   * @memberof ChangePasswordComponent
   */
  public currentPass: any;

  /**
   * new password form name
   * @type {*}
   * @memberof ChangePasswordComponent
   */
  public newPass: any;

  /**
   * confirm password form name
   * @type {*}
   * @memberof ChangePasswordComponent
   */
  public confirmPass: any;

  /**
   * hide current password open-eye icon
   * @type {boolean}
   * @memberof ChangePasswordComponent
   */
  public hideCurrent: boolean = false;

  /**
   * hide new password open-eye icon
   * @type {boolean}
   * @memberof ChangePasswordComponent
   */
  public hideNew: boolean = false;

  /**
   * hide confirm password open-eye icon
   * @type {boolean}
   * @memberof ChangePasswordComponent
   */
  public hideConfirm: boolean = false;

  /**
   * form group
   * @type {FormGroup}
   * @memberof ChangePasswordComponent
   */
  public myForm: FormGroup;

  /**
   * matcher error
   * @memberof ChangePasswordComponent
   */
  public matcher = new MyErrorStateMatcher();

  /**
   *Creates an instance of ChangePasswordComponent.
   * @param {MatDialogRef<ChangePasswordComponent>} dialog
   * @param {*} data
   * @param {FormBuilder} formBuilder
   * @memberof ChangePasswordComponent
   */
  constructor(public dialog: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      currentPass: ['', Validators.required],
      newPass: ['', [Validators.required]],
      confirmPass: ['']
    }, { validator: this.checkPasswords });
  }

  /**
   * initial method
   * @memberof ChangePasswordComponent
   */
  ngOnInit() {
  }

  /**
   * check new pass & confirm pass match or not
   * @param {FormGroup} group
   * @returns
   * @memberof ChangePasswordComponent
   */
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.newPass.value;
    let confirmPass = group.controls.confirmPass.value;
    return pass === confirmPass ? null : { notSame: true }
  }

  /**
   * click to close dialog
   * @memberof ChangePasswordComponent
   */
  close(): void {
    this.dialog.close();
  }

}
