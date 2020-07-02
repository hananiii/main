import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { EmailInvitationComponent } from './email-invitation.component';


const routes: Routes = [
    {
        path: '',
        component: EmailInvitationComponent,
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
    declarations: [EmailInvitationComponent]
})
export class EmailInvitationModule { }
