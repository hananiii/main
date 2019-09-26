import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { EmailInvitationPage } from './email-invitation.component';


const routes: Routes = [
    {
        path: '',
        component: EmailInvitationPage,
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
    declarations: [EmailInvitationPage]
})
export class EmailInvitationModule { }
