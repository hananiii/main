import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { LeaveEntitlementPage } from './leave-entitlement.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatTabsModule } from '@angular/material/tabs';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { SpinnerModule } from 'src/library/spinner/spinner.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { NotificationPage } from './leave-planning/apply-leave/notification/notification.component';
import { LeavePlanningPage } from './leave-planning/leave-planning.component';
import { ApplyLeavePage } from './leave-planning/apply-leave/apply-leave.component';
import { CalendarViewPage } from './leave-planning/calendar-view/calendar-view.component';


const routes: Routes = [
  {
    path: '',
    component: LeaveEntitlementPage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InlineSVGModule,
    MatTabsModule,
    BrowserModule,
    FullCalendarModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatRadioModule,
    SpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [NotificationPage],
  declarations: [LeaveEntitlementPage, LeavePlanningPage, ApplyLeavePage, CalendarViewPage, NotificationPage]
})
export class LeaveEntitlementModule { }
