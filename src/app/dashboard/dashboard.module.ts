import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatIconModule } from '@angular/material/icon';
import { DashboardComponent } from './dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { GoogleChartModule } from 'src/library/google-chart/google-chart.module';
import { SpinnerModule } from 'src/library/spinner/spinner.module';
import { MatTooltipModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';


const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
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
        MatGridListModule,
        GoogleChartModule,
        SpinnerModule,
        MatTooltipModule,
        MatChipsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule { }

