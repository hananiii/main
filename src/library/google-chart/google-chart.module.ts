import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { GoogleChartComponent } from './google-chart.component';
import { GoogleChartsModule } from 'angular-google-charts';


const routes: Routes = [
    {
        path: '',
        component: GoogleChartComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        GoogleChartsModule,
        RouterModule.forChild(routes)
    ],
    exports: [GoogleChartComponent],
    declarations: [GoogleChartComponent]
})
export class GoogleChartModule { }

