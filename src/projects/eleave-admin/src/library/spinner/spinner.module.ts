import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SpinnerComponent } from '$admin-root/src/library/spinner/spinner.component';


const routes: Routes = [
    {
        path: '',
        component: SpinnerComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    exports: [SpinnerComponent],
    declarations: [SpinnerComponent]
})
export class SpinnerModule { }

