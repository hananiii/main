import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { InlineSVGModule } from 'ng-inline-svg';
import { AccountSettingComponent } from './account-setting.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatDialogModule } from '@angular/material';


const routes: Routes = [
    {
        path: '',
        component: AccountSettingComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatIconModule,
        MatDialogModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        InlineSVGModule,
        RouterModule.forChild(routes)
    ],
    declarations: [AccountSettingComponent, ChangePasswordComponent],
    entryComponents: [ChangePasswordComponent]
})
export class AccountSettingModule { }
