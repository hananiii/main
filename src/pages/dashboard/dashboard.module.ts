import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatIconModule } from '@angular/material/icon';
import { DashboardPage } from './dashboard.page';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';


const routes: Routes = [
    {
        path: '',
        component: DashboardPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatIconModule,
        MatCardModule,
        MatListModule,
        RouterModule.forChild(routes)
    ],
    declarations: [DashboardPage]
})
export class DashboardModule { }

