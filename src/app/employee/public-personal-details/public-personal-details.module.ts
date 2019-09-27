import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { PublicPersonalDetailsComponent } from './public-personal-details.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { SpinnerModule } from 'src/library/spinner/spinner.module';


const routes: Routes = [
  {
    path: '',
    component: PublicPersonalDetailsComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatCardModule,
    InlineSVGModule,
    SpinnerModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  declarations: [PublicPersonalDetailsComponent]
})
export class PublicPersonalDetailsModule { }
